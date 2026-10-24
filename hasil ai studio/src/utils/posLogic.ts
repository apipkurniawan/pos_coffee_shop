import { InventoryItem, Order, OrderItem, OrderItemCustomization, MenuItemRecipeIngredient } from '../types/pos';

/**
 * Calculates customized price for a single unit of an order item
 */
export function calculateItemUnitPrice(basePrice: number, cust: OrderItemCustomization): number {
  let price = basePrice;
  if (cust.size === 'large') {
    price += 5000;
  }
  if (cust.milk === 'oat') {
    price += 8000;
  } else if (cust.milk === 'almond') {
    price += 10000;
  }
  if (cust.extraShot) {
    price += 5000;
  }
  return price;
}

export interface OrderTotals {
  subtotal: number;
  voucherDiscount: number;
  taxableAmount: number;
  tax: number;
  total: number;
  freeCupItemName?: string;
}

/**
 * Calculates order subtotal, voucher discount (1 free cup), PB1 tax (10%), and grand total
 */
export function calculateOrderTotals(
  items: OrderItem[],
  voucherApplied: boolean = false,
  taxRate: number = 0.1
): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let voucherDiscount = 0;
  let freeCupItemName: string | undefined;

  if (voucherApplied && items.length > 0) {
    // Find highest priced qualifying cup beverage
    const cupItems = items.filter((item) => item.isCupBeverage && item.quantity > 0);
    if (cupItems.length > 0) {
      // Pick highest price cup to give maximum customer value
      const sorted = [...cupItems].sort((a, b) => b.unitPrice - a.unitPrice);
      const targetItem = sorted[0];
      voucherDiscount = targetItem.unitPrice;
      freeCupItemName = targetItem.name;
    }
  }

  const taxableAmount = Math.max(0, subtotal - voucherDiscount);
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  return {
    subtotal,
    voucherDiscount,
    taxableAmount,
    tax,
    total,
    freeCupItemName,
  };
}

export interface CashPaymentResult {
  isPaid: boolean;
  change: number;
  deficit: number;
}

/**
 * Validates cash payment and computes change or deficit
 */
export function calculateCashPayment(total: number, cashReceived: number): CashPaymentResult {
  if (cashReceived >= total) {
    return {
      isPaid: true,
      change: cashReceived - total,
      deficit: 0,
    };
  }
  return {
    isPaid: false,
    change: 0,
    deficit: total - cashReceived,
  };
}

/**
 * Counts the number of PAID cups in an order (excluding complimentary free cups)
 */
export function countPaidBeverageCups(items: OrderItem[], voucherApplied: boolean): number {
  const totalCupCount = items
    .filter((item) => item.isCupBeverage)
    .reduce((sum, item) => sum + item.quantity, 0);

  if (voucherApplied && totalCupCount > 0) {
    return Math.max(0, totalCupCount - 1);
  }
  return totalCupCount;
}

export interface LoyaltyCalculationResult {
  previousProgress: number;
  paidCupsAdded: number;
  newProgress: number; // 0..9
  vouchersEarned: number;
  totalLifetimeAdded: number;
}

/**
 * Computes loyalty stamp progress and determines if 10-cup milestone voucher is earned
 */
export function calculateLoyaltyProgress(
  currentProgress: number,
  paidCupsCount: number
): LoyaltyCalculationResult {
  const totalAccumulated = currentProgress + paidCupsCount;
  const vouchersEarned = Math.floor(totalAccumulated / 10);
  const newProgress = totalAccumulated % 10;

  return {
    previousProgress: currentProgress,
    paidCupsAdded: paidCupsCount,
    newProgress,
    vouchersEarned,
    totalLifetimeAdded: paidCupsCount,
  };
}

/**
 * Deducts ingredient stock according to recipe deductions
 */
export function deductInventoryStock(
  currentInventory: InventoryItem[],
  recipeUsage: { ingredientId: string; amount: number }[]
): InventoryItem[] {
  const usageMap = new Map<string, number>();
  for (const usage of recipeUsage) {
    usageMap.set(usage.ingredientId, (usageMap.get(usage.ingredientId) || 0) + usage.amount);
  }

  return currentInventory.map((item) => {
    const used = usageMap.get(item.id) || 0;
    return {
      ...item,
      currentStock: Math.max(0, item.currentStock - used),
    };
  });
}

/**
 * Calculates HPP (Cost of Goods Sold) based on recipe ingredients and ingredient unit cost
 */
export function calculateRecipeCost(
  recipe: MenuItemRecipeIngredient[],
  inventory: InventoryItem[]
): number {
  let cost = 0;
  for (const r of recipe) {
    const ing = inventory.find((i) => i.id === r.ingredientId);
    if (ing) {
      cost += r.amount * ing.costPerUnit;
    }
  }
  return Math.round(cost);
}

/**
 * Calculates gross profit margin percentage
 */
export function calculateProfitMargin(sellingPrice: number, costPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return Math.round(((sellingPrice - costPrice) / sellingPrice) * 100);
}

export interface CashSessionSummary {
  startingCash: number;
  totalCashSales: number;
  totalNonCashSales: number;
  totalSales: number;
  totalOrdersCount: number;
  expectedDrawerCash: number;
}

/**
 * Calculates cash register session totals
 */
export function calculateCashSessionSummary(
  startingCash: number,
  orders: Order[]
): CashSessionSummary {
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  let totalCashSales = 0;
  let totalNonCashSales = 0;

  for (const o of paidOrders) {
    if (o.paymentMethod === 'cash') {
      totalCashSales += o.total;
    } else {
      totalNonCashSales += o.total;
    }
  }

  return {
    startingCash,
    totalCashSales,
    totalNonCashSales,
    totalSales: totalCashSales + totalNonCashSales,
    totalOrdersCount: paidOrders.length,
    expectedDrawerCash: startingCash + totalCashSales,
  };
}

/**
 * Formats Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}
