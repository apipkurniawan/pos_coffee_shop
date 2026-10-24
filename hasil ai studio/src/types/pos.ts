export type UserRole = 'owner' | 'admin' | 'cashier' | 'barista';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor?: string;
}

export type CategoryId = 'espresso' | 'manual_brew' | 'milk_tea' | 'pastry_bites' | 'seasonal';

export interface MenuItemRecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'pcs';
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  basePrice: number;
  costPrice: number; // HPP (Harga Pokok Penjualan)
  description: string;
  isCupBeverage: boolean;
  isAvailable: boolean;
  salesCount: number;
  image?: string;
  badge?: string;
  recipe: MenuItemRecipeIngredient[];
}

export interface OrderItemCustomization {
  temperature?: 'hot' | 'iced';
  size?: 'regular' | 'large';
  sugar?: 'normal' | 'less' | 'none';
  milk?: 'fresh' | 'oat' | 'almond';
  extraShot?: boolean;
  notes?: string;
}

export interface OrderItem {
  id: string; // unique cart entry ID
  menuItemId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  isCupBeverage: boolean;
  customization: OrderItemCustomization;
  isVoucherComplimentary?: boolean;
}

export type ServiceType = 'dine_in' | 'takeaway';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'free_cup' | 'percent' | 'nominal';
  discountValue?: number; // e.g. 15 for 15% or 10000 for Rp10.000
  status: 'available' | 'used' | 'expired';
  expiryDate: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  cupProgress: number; // 0..9 (milestone at 10)
  totalLifetimeCups: number;
  vouchers: Voucher[];
  joinedDate: string;
}

export type PaymentMethod = 'cash' | 'qris' | 'card' | 'ewallet';

export type PaymentStatus = 'paid' | 'unpaid' | 'failed';

export type BaristaStatus = 'queued' | 'preparing' | 'ready' | 'completed';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'coffee' | 'dairy' | 'packaging' | 'sweetener' | 'pastry';
  currentStock: number;
  minThreshold: number;
  costPerUnit: number; // e.g. Rp 350/g
  unit: 'g' | 'ml' | 'pcs';
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: 'in' | 'out_order' | 'adjustment' | 'waste';
  amount: number;
  unit: string;
  balanceAfter: number;
  reason: string;
  timestamp: string;
}

export interface TableItem {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
  activeOrderNumber?: string;
}

export interface CashSession {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  startingCash: number;
  expectedCash: number; // startingCash + cash received from orders
  actualCash?: number;
  difference?: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  taxPercent: number; // 10%
  servicePercent: number; // 0%
  receiptFooter: string;
  currency: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  timestamp: string;
  serviceType: ServiceType;
  tableNumber?: string;
  takeawayName?: string;
  memberId?: string;
  memberName?: string;
  memberPhone?: string;
  items: OrderItem[];
  subtotal: number;
  voucherDiscount: number;
  voucherUsedId?: string;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashReceived?: number;
  cashChange?: number;
  baristaStatus: BaristaStatus;
  cupsAddedToLoyalty: number;
  earnedNewVoucher: boolean;
}
