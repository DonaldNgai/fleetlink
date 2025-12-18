import type { EquipmentBooking, EquipmentSupply } from '@repo/next-utils/db/schema';

// Type for the joined data that matches data.json structure
export type BookingWithSupply = {
  booking: Pick<
    EquipmentBooking,
    | 'id'
    | 'equipment'
    | 'customer'
    | 'location'
    | 'bookingDate'
    | 'customerStatus'
    | 'hours'
    | 'totalCustomerCharges'
    | 'operatorFirstName'
    | 'operatorLastName'
  >;
  supply:
    | (Pick<EquipmentSupply, 'id' | 'category'> & {
        hourlyRate?: string;
      })
    | null;
};
