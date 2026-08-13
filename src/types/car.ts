export type CarType =
  | 'SUV'
  | 'Sedan'
  | 'Hatchback'
  | 'Luxury'
  | 'Convertible';

export type FuelType =
  | 'Petrol'
  | 'Diesel'
  | 'Electric'
  | 'Hybrid';

export type TransmissionType =
  | 'Manual'
  | 'Automatic';

export type ListingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'sold'
  | 'inactive';

export interface Car {
  id: string;

  // Basic information
  make: string;
  model: string;
  year: number;

  type: CarType;
  fuelType: FuelType;
  transmission: TransmissionType;

  // Vehicle information
  mileage: number;
  color?: string;

  // Images
  images: string[];
  thumbnail?: string;

  // Rental
  isAvailableForRent: boolean;
  pricePerDay?: number;

  // Marketplace
  isListedForSale: boolean;
  salePrice?: number;

  // Ownership
  ownerId?: string;
  ownerName?: string;

  // Listing management
  listingStatus: ListingStatus;

  // Admin workflow
  rejectionReason?: string;
  adminNotes?: string;
  reviewedBy?: string;

  // Metadata
  createdAt?: unknown;
  updatedAt?: unknown;
}