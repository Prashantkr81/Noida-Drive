export type QuoteStatus =
  | 'pending'
  | 'reviewing'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface Quote {
  id: string;

  // Car
  carId: string;
  carMake: string;
  carModel: string;

  // Buyer
  buyerId: string;
  buyerName?: string;
  buyerPhone?: string;

  // Seller
  sellerId?: string;

  // Quote
  offeredPrice: number;
  message?: string;

  // Admin workflow
  status: QuoteStatus;
  adminNotes?: string;
  reviewedBy?: string;
  rejectionReason?: string;

  // Metadata
  createdAt?: unknown;
  updatedAt?: unknown;
}