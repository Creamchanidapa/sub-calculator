export interface ItemInput {
  id: string;
  name?: string;
  price: number;
  quantity?: number;
  assignedPersonIds?: string[]; // Multiple persons can share a dish (default 1 person)
}

export interface CalculatedItem {
  id: string;
  name: string;
  originalPrice: number; // price * quantity
  quantity: number;
  unitPrice: number;
  weightedPrice: number; // final rounded proportional price
  rawPrice: number;
  discountOrExtra: number;
  assignedPersonIds: string[];
}

export interface Person {
  id: string;
  name: string;
  avatarColor?: string;
}

export interface PersonShare {
  personId: string;
  personName: string;
  items: {
    itemId: string;
    itemName: string;
    originalShare: number;
    weightedShare: number;
    isShared: boolean;
  }[];
  totalOriginal: number;
  totalWeighted: number;
}

export interface SplitResult {
  items: CalculatedItem[];
  totalFoodOriginal: number;
  totalPaid: number;
  differenceFromOriginal: number; // negative means discount, positive means extra fee/delivery
  percentAdjustment: number;
  isValid: boolean;
  validationMessage?: string;
  personShares: PersonShare[];
  isBalanced: boolean;
  sumWeighted: number;
}

export type SplitMode = 'proportional_item' | 'equal' | 'person_assigned';

export interface ExtraFees {
  deliveryFee: number;
  discount: number;
  discountType?: 'baht' | 'percent';
  coupon?: number;
  otherFee?: number;
}

export interface AppState {
  people: Person[];
  items: ItemInput[];
  totalPaid: string;
  mode: SplitMode;
  extraFees: ExtraFees;
}
