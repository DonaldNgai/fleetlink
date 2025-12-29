'use server';

import { prisma } from '@/db/prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { getCustomerForCurrentUser } from '@/db/queries/customer';
import { callN8nWebhook, formatRentalBookingForWebhook } from './webhooks';
import type { Prisma } from '@prisma/client';
import { auth0 } from '@/lib/auth/auth0';

// Constants
const EQUIPMENT_PRICING: Record<
  string,
  { ourRate: number; marketRate: number; supplierRate: number; sourcerRate: number }
> = {
  triaxle: { ourRate: 120, marketRate: 150, supplierRate: 100, sourcerRate: 20 },
  sweeper: { ourRate: 225, marketRate: 280, supplierRate: 190, sourcerRate: 35 },
  water: { ourRate: 150, marketRate: 190, supplierRate: 125, sourcerRate: 25 },
  hydrovac: { ourRate: 200, marketRate: 250, supplierRate: 170, sourcerRate: 30 },
  excavator: { ourRate: 180, marketRate: 225, supplierRate: 150, sourcerRate: 30 },
  loader: { ourRate: 140, marketRate: 175, supplierRate: 115, sourcerRate: 25 },
  bulldozer: { ourRate: 160, marketRate: 200, supplierRate: 135, sourcerRate: 25 },
  crane: { ourRate: 250, marketRate: 310, supplierRate: 220, sourcerRate: 30 },
};

const EQUIPMENT_NAMES: Record<string, string> = {
  triaxle: 'Tri Axle Dump Truck',
  sweeper: 'Sweeper Truck',
  water: 'Water Truck',
  hydrovac: 'Hydrovac Truck',
  excavator: 'Excavator',
  loader: 'Loader',
  bulldozer: 'Bulldozer',
  crane: 'Crane',
};

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

// Types
export type CreateRentalBookingState = {
  error?: string;
  success?: string;
  bookingId?: string;
};

type RentalBookingData = {
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  rentalDates: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  formData: {
    hours: string;
    location: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    specialInstructions?: string;
  };
  mapLocation: {
    lat: NonNullable<Prisma.Equipment_BookingsCreateInput['location_latitude']>;
    lng: NonNullable<Prisma.Equipment_BookingsCreateInput['location_longitude']>;
  } | null;
};

type EquipmentInfo = {
  id: string;
  name: string;
  quantity: number;
  pricing: { ourRate: number; supplierRate: number; sourcerRate: number };
};

// Helper Functions
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function parseOperatorName(contactName: string): { firstName: string; lastName: string | null } {
  const nameParts = contactName.trim().split(' ');
  return {
    firstName: nameParts[0] || contactName,
    lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : null,
  };
}

function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

function calculateHours(startDateTime: Date, endDateTime: Date): number {
  return (endDateTime.getTime() - startDateTime.getTime()) / MILLISECONDS_PER_HOUR;
}

function buildFullLocation(address: string, city: string, state: string, zipCode: string): string {
  return [address, city, state, zipCode].filter(Boolean).join(', ');
}

function getEquipmentInfo(equipmentId: string, quantity: number): EquipmentInfo {
  const pricing = EQUIPMENT_PRICING[equipmentId];
  if (!pricing) {
    throw new Error(`Pricing not found for equipment: ${equipmentId}`);
  }

  return {
    id: equipmentId,
    name: EQUIPMENT_NAMES[equipmentId] || equipmentId,
    quantity,
    pricing,
  };
}

function getCustomerName(
  contactName: string,
  customer: { company_name: string } | null,
  user: { name: string | null; email: string | null }
): string {
  return contactName || customer?.company_name || user.name || user.email || 'Unknown';
}

async function findOrCreateCustomer(
  user: { email: string | null; name: string | null },
  formData: RentalBookingData['formData']
): Promise<{ id: bigint } | null> {
  // Try to find existing customer by email
  if (user.email) {
    const existingCustomer = await prisma.customers.findFirst({
      where: { email: user.email },
    });
    if (existingCustomer) {
      return { id: existingCustomer.id };
    }
  }

  // Create new customer if not found
  // Use form email or user email, fallback to contact email
  const email = formData.contactEmail || user.email;
  if (!email) {
    return null; // Cannot create customer without email
  }

  // Parse contact name for first/last name
  const { firstName, lastName } = parseOperatorName(formData.contactName);
  
  // Use contact name as company name, or user name, or email domain
  const companyName = formData.contactName || user.name || email.split('@')[0] || 'Customer';

  // Phone is required, use form phone or a placeholder
  const phone = formData.contactPhone || '000-000-0000';

  const newCustomer = await prisma.customers.create({
    data: {
      company_name: companyName,
      contact_first_name: firstName,
      contact_last_name: lastName,
      phone: phone,
      email: email,
    },
  });

  return { id: newCustomer.id };
}

// Validation Functions
function validateRentalData(data: RentalBookingData): CreateRentalBookingState | null {
  if (!data.selectedEquipment?.length) {
    return { error: 'At least one equipment must be selected' };
  }

  if (!data.rentalDates.startDate || !data.rentalDates.startTime) {
    return { error: 'Start date and time are required' };
  }

  if (!data.rentalDates.endDate || !data.rentalDates.endTime) {
    return { error: 'End date and time are required' };
  }

  if (!data.formData.contactName) {
    return { error: 'Contact name is required' };
  }

  if (!data.formData.address && !data.formData.city && !data.formData.location) {
    return { error: 'Location information is required (address, city, or location)' };
  }

  return null;
}

function validateDateRange(startDateTime: Date, endDateTime: Date): CreateRentalBookingState | null {
  if (isNaN(startDateTime.getTime())) {
    return { error: 'Invalid start date/time' };
  }

  if (isNaN(endDateTime.getTime())) {
    return { error: 'Invalid end date/time' };
  }

  if (endDateTime <= startDateTime) {
    return { error: 'End date/time must be after start date/time' };
  }

  return null;
}

// Main Server Action
export async function createRentalBooking(
  data: RentalBookingData
): Promise<CreateRentalBookingState> {
  try {
    // Get user and find or create customer
    const user = await getCurrentUserFullDetails(auth0);
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Find or create customer to ensure we have a customer_id
    const customerRecord = await findOrCreateCustomer(user, data.formData);
    if (!customerRecord) {
      return { error: 'Unable to create customer record. Email is required.' };
    }

    // Get full customer details for webhook payload
    const customer = await prisma.customers.findUnique({
      where: { id: customerRecord.id },
    });

    // Validate input data
    const validationError = validateRentalData(data);
    if (validationError) {
      return validationError;
    }

    // Parse dates and validate
    const startDateTime = parseDateTime(data.rentalDates.startDate, data.rentalDates.startTime);
    const endDateTime = parseDateTime(data.rentalDates.endDate, data.rentalDates.endTime);

    const dateValidationError = validateDateRange(startDateTime, endDateTime);
    if (dateValidationError) {
      return dateValidationError;
    }

    // Calculate hours
    const providedHours = data.formData.hours ? parseFloat(data.formData.hours) : 0;
    const hoursFromDates = calculateHours(startDateTime, endDateTime);
    const hours = providedHours > 0 ? providedHours : hoursFromDates;

    if (hours <= 0) {
      return { error: 'Hours must be greater than 0. Please check your rental dates or provide hours.' };
    }

    // Prepare data
    const bookingDate = startDateTime;
    const bookingGroupId = generateUUID();
    const { firstName: operatorFirstName, lastName: operatorLastName } = parseOperatorName(
      data.formData.contactName
    );
    const fullLocation = buildFullLocation(
      data.formData.address,
      data.formData.city,
      data.formData.state,
      data.formData.zipCode
    );
    const customerId = BigInt(customerRecord.id);
    const customerName = getCustomerName(data.formData.contactName, customer, user);

    // Create booking records for each equipment type
    const bookings = await Promise.all(
      data.selectedEquipment.map(async (equipmentId) => {
        const quantity = data.equipmentQuantities[equipmentId] || 1;
        const equipmentInfo = getEquipmentInfo(equipmentId, quantity);

        return await prisma.equipment_Bookings.create({
          data: {
            booking_date: bookingDate,
            customer: customerName,
            supplier: null,
            supplier_id: null,
            location: fullLocation || data.formData.location,
            location_longitude: data.mapLocation?.lng || null,
            location_latitude: data.mapLocation?.lat || null,
            number_equipment: quantity,
            customer_rate: equipmentInfo.pricing.ourRate,
            hours: hours,
            supplier_rate: equipmentInfo.pricing.supplierRate,
            sourcer_rate: equipmentInfo.pricing.sourcerRate,
            customer_id: customerId,
            operator_first_name: operatorFirstName,
            operator_last_name: operatorLastName,
            booking_group_id: bookingGroupId,
            supplier_status: 'active',
            customer_status: 'active',
            equipment: equipmentInfo.name,
          },
        });
      })
    );

    // Prepare equipment data for webhook
    const equipmentData = data.selectedEquipment.map((equipmentId) => {
      const quantity = data.equipmentQuantities[equipmentId] || 1;
      const equipmentInfo = getEquipmentInfo(equipmentId, quantity);
      return {
        id: equipmentInfo.id,
        name: equipmentInfo.name,
        quantity: equipmentInfo.quantity,
        customerRate: equipmentInfo.pricing.ourRate,
        supplierRate: equipmentInfo.pricing.supplierRate,
        sourcerRate: equipmentInfo.pricing.sourcerRate,
      };
    });

    // Send webhook notification (non-blocking)
    // Use the first booking's ID as the bookingGroupId for the webhook
    const firstBookingId = bookings[0]?.id || BigInt(0);
    const webhookPayload = await formatRentalBookingForWebhook({
      bookingGroupId: firstBookingId,
      bookingDate,
      hours,
      location: {
        address: data.formData.address,
        city: data.formData.city,
        state: data.formData.state,
        zipCode: data.formData.zipCode,
        fullLocation: fullLocation || data.formData.location,
        latitude: data.mapLocation?.lat || undefined,
        longitude: data.mapLocation?.lng || undefined,
      },
      equipment: equipmentData,
      contact: {
        name: data.formData.contactName,
        firstName: operatorFirstName,
        lastName: operatorLastName || undefined,
        phone: data.formData.contactPhone || undefined,
        email: data.formData.contactEmail || undefined,
      },
      customer: customer
        ? {
            id: customer.id,
            company_name: customer.company_name,
            contact_first_name: customer.contact_first_name,
            contact_last_name: customer.contact_last_name ?? null,
            email: customer.email,
            phone: customer.phone,
          }
        : {
            // Fallback if customer fetch fails (shouldn't happen)
            id: customerRecord.id,
            company_name: getCustomerName(data.formData.contactName, null, user),
            contact_first_name: operatorFirstName,
            contact_last_name: operatorLastName || null,
            email: data.formData.contactEmail || user.email || '',
            phone: data.formData.contactPhone || '',
          },
      user: {
        id: Number.parseInt(user.id as string, 10) || 0,
        name: user.name ?? undefined,
        email: user.email ?? '',
      },
      specialInstructions: data.formData.specialInstructions ?? undefined,
      rentalPeriod: data.rentalDates,
    });

    callN8nWebhook('N8N_RENTAL_WEBHOOK_URL', webhookPayload).catch((error) => {
      console.error('Failed to call n8n webhook:', error);
    });

    return {
      success: 'Rental booking created successfully',
      bookingId: bookingGroupId,
    };
  } catch (error) {
    console.error('Error creating rental booking:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to create rental booking',
    };
  }
}

