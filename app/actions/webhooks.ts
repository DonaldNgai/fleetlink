'use server';

import type { Customers, Equipment_Bookings } from '@prisma/client';
import type { Prisma } from '@prisma/client';

/**
 * Calls an n8n webhook URL with the provided data
 * 
 * @param webhookEnvVar - The name of the environment variable containing the webhook URL
 * @param data - The data payload to send to the webhook
 * @returns Promise with success status and response data or error
 */
export async function callN8nWebhook<T = any>(
  webhookEnvVar: string,
  data: T
): Promise<{ success: boolean; response?: any; error?: string }> {
  try {
    const webhookUrl = process.env[webhookEnvVar];

    if (!webhookUrl) {
      console.error(`Webhook URL not found for environment variable: ${webhookEnvVar}`);
      return {
        success: false,
        error: `Webhook URL not configured. Environment variable "${webhookEnvVar}" is not set.`,
      };
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch {
      return {
        success: false,
        error: `Invalid webhook URL format for "${webhookEnvVar}"`,
      };
    }

    // Make POST request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Webhook call failed: ${response.status} ${response.statusText}`, errorText);
      return {
        success: false,
        error: `Webhook call failed: ${response.status} ${response.statusText}`,
      };
    }

    // Try to parse response as JSON, fallback to text
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      success: true,
      response: responseData,
    };
  } catch (error) {
    console.error(`Error calling webhook "${webhookEnvVar}":`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error calling webhook',
    };
  }
}

/**
 * Type definition for rental booking webhook payload
 */
export interface RentalBookingWebhookPayload {
  // Booking information - using Prisma EquipmentBooking types
  bookingGroupId: Pick<Equipment_Bookings, 'id'>['id'];
  bookingDate: string;
  hours: NonNullable<Prisma.Equipment_BookingsCreateInput['hours']>;
  location: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    fullLocation: string;
    latitude?: NonNullable<Prisma.Equipment_BookingsCreateInput['location_latitude']>;
    longitude?: NonNullable<Prisma.Equipment_BookingsCreateInput['location_longitude']>;
  };
  
  // Equipment details
  equipment: Array<{
    id: string;
    name: string;
    quantity: number;
    customerRate: number;
    supplierRate: number;
    sourcerRate: number;
  }>;
  
  // Contact information
  contact: {
    name: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
  
  // Customer information (if available) - using Prisma Customer type
  customer?: Pick<
    Customers,
    'id' | 'company_name' | 'contact_first_name' | 'contact_last_name' | 'email' | 'phone'
  >;
  
  // User information
  user: {
    id: number;
    name?: string;
    email: string;
  };
  
  // Additional information
  specialInstructions?: string;
  rentalPeriod: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  
  // Pricing summary - using Prisma EquipmentBooking computed field types
  pricing: {
    totalCustomerCharges: number;
    totalSupplierEarnings: number;
    totalSourcerEarnings: number;
  };
}

/**
 * Helper function to format rental booking data for n8n webhook
 */
export async function formatRentalBookingForWebhook(data: {
  bookingGroupId: Pick<Equipment_Bookings, 'id'>['id'];
  bookingDate: Date;
  hours: NonNullable<Prisma.Equipment_BookingsCreateInput['hours']>;
  location: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    fullLocation: string;
    latitude?: NonNullable<Prisma.Equipment_BookingsCreateInput['location_latitude']>;
    longitude?: NonNullable<Prisma.Equipment_BookingsCreateInput['location_longitude']>;
  };
  equipment: Array<{
    id: string;
    name: string;
    quantity: number;
    customerRate: number;
    supplierRate: number;
    sourcerRate: number;
  }>;
  contact: {
    name: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
  customer?: Pick<
    Customers,
    'id' | 'company_name' | 'contact_first_name' | 'contact_last_name' | 'email' | 'phone'
  >;
  user: {
    id: number;
    name?: string;
    email: string;
  };
  specialInstructions?: string;
  rentalPeriod: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
}): Promise<RentalBookingWebhookPayload> {
  // Calculate pricing totals
  const totalCustomerCharges = data.equipment.reduce(
    (sum, eq) => sum + eq.customerRate * eq.quantity * data.hours,
    0
  );
  const totalSupplierEarnings = data.equipment.reduce(
    (sum, eq) => sum + eq.supplierRate * eq.quantity * data.hours,
    0
  );
  const totalSourcerEarnings = data.equipment.reduce(
    (sum, eq) => sum + eq.sourcerRate * eq.quantity * data.hours,
    0
  );

  return {
    bookingGroupId: data.bookingGroupId,
    bookingDate: data.bookingDate.toISOString(),
    hours: data.hours,
    location: data.location,
    equipment: data.equipment,
    contact: data.contact,
    customer: data.customer,
    user: data.user,
    specialInstructions: data.specialInstructions,
    rentalPeriod: data.rentalPeriod,
    pricing: {
      totalCustomerCharges,
      totalSupplierEarnings,
      totalSourcerEarnings,
    },
  };
}


