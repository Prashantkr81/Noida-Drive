export type SellSubmissionStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type CarCondition =
  | 'excellent'
  | 'good'
  | 'fair';

export interface SellSubmission {
  id: string;

  // Seller
  sellerId: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;

  // Car
  make: string;
  model: string;
  year: number;
  kilometersDriven: number;

  condition: CarCondition;

  // Car details
  fuelType?: string;
  transmission?: string;
  color?: string;

  // Images
  images?: string[];

  // Seller expectations
  expectedPrice?: number;

  // Admin workflow
  status: SellSubmissionStatus;

  adminNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;

  // Final marketplace listing
  listingId?: string;

  // Metadata
  createdAt?: unknown;
  updatedAt?: unknown;
}