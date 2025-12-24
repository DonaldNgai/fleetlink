import type { Equipment_Bookings, Equipment_Supply } from '@prisma/client';

// Type for the joined data that matches data.json structure
export type BookingWithSupply = {
  booking: Pick<
    Equipment_Bookings,
    | 'id'
    | 'equipment'
    | 'customer'
    | 'location'
    | 'booking_date'
    | 'customer_status'
    | 'hours'
    | 'total_customer_charges'
    | 'operator_first_name'
    | 'operator_last_name'
  >;
  supply:
    | (Pick<Equipment_Supply, 'id' | 'category'> & {
        hourlyRate?: string;
      })
    | null;
};
