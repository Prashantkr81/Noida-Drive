export type BookingStatus =
  | 'pending'
  | 'reviewing'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export type RentalType =
  | 'self_drive'
  | 'chauffeur';

export interface Booking {
  id: string;

  // User
  userId: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;

  // Car
  carId: string;
  carMake: string;
  carModel: string;

  // Rental
  rentalType: RentalType;

  // Requested rental period
  startDate: unknown;
  endDate: unknown;

  // Location
  pickupLocation: string;
  dropLocation?: string;

  // Optional requirements
  specialRequest?: string;

  // Pricing
  estimatedPrice?: number;
  finalPrice?: number;

  // Admin / company workflow
  status: BookingStatus;
  adminNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;

  // Metadata
  createdAt?: unknown;
  updatedAt?: unknown;
}