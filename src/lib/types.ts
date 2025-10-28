export type UserRole = 'buyer' | 'seller' | 'authority' | null;
export type Language = 'en' | 'ta' | 'hi' | 'bn';

export interface FishListing {
  id: string;
  sellerId: string;
  name: string;
  weight: number; // in kg
  price: number; // per kg
  freshness: 'Just Caught' | '1-2 Days' | '3+ Days';
  imageUrl: string;
  imageHint: string;
  dateListed: string;
}

export interface Purchase {
  id: string;
  listing: FishListing;
  buyerId: string;
  quantity: number; // in kg
  purchaseDate: string;
  totalPrice: number;
  commission: number;
  tax: number;
  finalBill: number;
}
