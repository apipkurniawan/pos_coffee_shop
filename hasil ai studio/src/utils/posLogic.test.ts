import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateOrderTotals,
  calculateCashPayment,
  calculateLoyaltyProgress,
  countPaidBeverageCups,
  deductInventoryStock,
  formatRupiah,
  calculateRecipeCost,
  calculateProfitMargin,
  calculateCashSessionSummary,
} from './posLogic';
import { OrderItem, InventoryItem, Order } from '../types/pos';

test('calculateItemUnitPrice adds size and milk modifiers correctly', () => {
  const base = 25000;
  // regular + fresh milk
  assert.equal(calculateItemUnitPrice(base, { size: 'regular', milk: 'fresh' }), 25000);
  // large (+5k) + oat milk (+8k) + extra shot (+5k)
  assert.equal(
    calculateItemUnitPrice(base, { size: 'large', milk: 'oat', extraShot: true }),
    25000 + 5000 + 8000 + 5000
  );
  // almond milk (+10k)
  assert.equal(calculateItemUnitPrice(base, { milk: 'almond' }), 35000);
});

test('calculateOrderTotals computes subtotal, free voucher cup, and 10% tax', () => {
  const items: OrderItem[] = [
    {
      id: '1',
      menuItemId: 'latte',
      name: 'Cafe Latte',
      basePrice: 30000,
      unitPrice: 30000,
      quantity: 2,
      isCupBeverage: true,
      customization: {},
    },
    {
      id: '2',
      menuItemId: 'americano',
      name: 'Iced Americano',
      basePrice: 22000,
      unitPrice: 22000,
      quantity: 1,
      isCupBeverage: true,
      customization: {},
    },
  ];

  // Without voucher
  const totalsWithoutVoucher = calculateOrderTotals(items, false, 0.1);
  assert.equal(totalsWithoutVoucher.subtotal, 82000); // 30k*2 + 22k = 82k
  assert.equal(totalsWithoutVoucher.voucherDiscount, 0);
  assert.equal(totalsWithoutVoucher.tax, 8200); // 10% of 82k
  assert.equal(totalsWithoutVoucher.total, 90200);

  // With free cup voucher (applies to highest priced cup: 30,000)
  const totalsWithVoucher = calculateOrderTotals(items, true, 0.1);
  assert.equal(totalsWithVoucher.subtotal, 82000);
  assert.equal(totalsWithVoucher.voucherDiscount, 30000);
  assert.equal(totalsWithVoucher.taxableAmount, 52000);
  assert.equal(totalsWithVoucher.tax, 5200);
  assert.equal(totalsWithVoucher.total, 57200);
  assert.equal(totalsWithVoucher.freeCupItemName, 'Cafe Latte');
});

test('calculateCashPayment checks exact payment, change and deficit', () => {
  // Exact payment
  const exact = calculateCashPayment(50000, 50000);
  assert.equal(exact.isPaid, true);
  assert.equal(exact.change, 0);
  assert.equal(exact.deficit, 0);

  // Overpayment (needs change)
  const over = calculateCashPayment(75000, 100000);
  assert.equal(over.isPaid, true);
  assert.equal(over.change, 25000);
  assert.equal(over.deficit, 0);

  // Underpayment (deficit)
  const under = calculateCashPayment(50000, 30000);
  assert.equal(under.isPaid, false);
  assert.equal(under.change, 0);
  assert.equal(under.deficit, 20000);
});

test('calculateLoyaltyProgress increments progress and triggers vouchers on 10 cups milestone', () => {
  // Member at 7 cups buys 2 cups -> progress becomes 9, 0 vouchers
  const res1 = calculateLoyaltyProgress(7, 2);
  assert.equal(res1.newProgress, 9);
  assert.equal(res1.vouchersEarned, 0);

  // Member at 7 cups buys 4 cups (total 11) -> 1 voucher earned, remaining progress 1
  const res2 = calculateLoyaltyProgress(7, 4);
  assert.equal(res2.newProgress, 1);
  assert.equal(res2.vouchersEarned, 1);

  // Member at 9 cups buys 1 cup (total 10) -> exactly 1 voucher earned, progress resets to 0
  const res3 = calculateLoyaltyProgress(9, 1);
  assert.equal(res3.newProgress, 0);
  assert.equal(res3.vouchersEarned, 1);

  // Buying 23 cups from 0 -> 2 vouchers earned, remaining 3
  const res4 = calculateLoyaltyProgress(0, 23);
  assert.equal(res4.newProgress, 3);
  assert.equal(res4.vouchersEarned, 2);
});

test('countPaidBeverageCups subtracts 1 complimentary cup if voucher applied', () => {
  const items: OrderItem[] = [
    {
      id: '1',
      menuItemId: 'latte',
      name: 'Latte',
      basePrice: 28000,
      unitPrice: 28000,
      quantity: 2,
      isCupBeverage: true,
      customization: {},
    },
    {
      id: '2',
      menuItemId: 'croissant',
      name: 'Croissant',
      basePrice: 20000,
      unitPrice: 20000,
      quantity: 1,
      isCupBeverage: false, // pastry not cup beverage
      customization: {},
    },
  ];

  // No voucher -> 2 paid cups
  assert.equal(countPaidBeverageCups(items, false), 2);
  // Voucher used -> 1 cup is free, 1 cup is paid
  assert.equal(countPaidBeverageCups(items, true), 1);
});

test('deductInventoryStock reduces stock accurately and does not go below 0', () => {
  const inventory: InventoryItem[] = [
    {
      id: 'beans-house',
      name: 'House Blend Coffee Beans',
      category: 'coffee',
      currentStock: 1000,
      minThreshold: 200,
      costPerUnit: 320,
      unit: 'g',
    },
    {
      id: 'milk-fresh',
      name: 'Fresh Whole Milk',
      category: 'dairy',
      currentStock: 50,
      minThreshold: 500,
      costPerUnit: 24,
      unit: 'ml',
    },
  ];

  const updated = deductInventoryStock(inventory, [
    { ingredientId: 'beans-house', amount: 36 },
    { ingredientId: 'milk-fresh', amount: 150 }, // exceeds 50
  ]);

  const beans = updated.find((i) => i.id === 'beans-house');
  assert.equal(beans?.currentStock, 964);

  const milk = updated.find((i) => i.id === 'milk-fresh');
  assert.equal(milk?.currentStock, 0); // clamped to 0
});

test('formatRupiah formats currency string correctly', () => {
  assert.match(formatRupiah(25000), /Rp.*25\.000/);
});

test('calculateRecipeCost calculates HPP correctly from ingredients', () => {
  const inventory: InventoryItem[] = [
    { id: 'b1', name: 'Beans', category: 'coffee', currentStock: 1000, minThreshold: 100, costPerUnit: 350, unit: 'g' },
    { id: 'm1', name: 'Milk', category: 'dairy', currentStock: 2000, minThreshold: 200, costPerUnit: 25, unit: 'ml' },
    { id: 'c1', name: 'Cup', category: 'packaging', currentStock: 500, minThreshold: 50, costPerUnit: 800, unit: 'pcs' },
  ];

  // Latte recipe: 18g beans (18*350 = 6300) + 150ml milk (150*25 = 3750) + 1 cup (800) = 10850
  const recipe = [
    { ingredientId: 'b1', name: 'Beans', amount: 18, unit: 'g' as const },
    { ingredientId: 'm1', name: 'Milk', amount: 150, unit: 'ml' as const },
    { ingredientId: 'c1', name: 'Cup', amount: 1, unit: 'pcs' as const },
  ];

  assert.equal(calculateRecipeCost(recipe, inventory), 10850);
});

test('calculateProfitMargin calculates correct margin percentage', () => {
  // Selling 30,000, Cost 10,850 -> Profit 19,150 -> 19150/30000 = 63.8% ~ 64%
  assert.equal(calculateProfitMargin(30000, 10850), 64);
  assert.equal(calculateProfitMargin(20000, 10000), 50);
});

test('calculateCashSessionSummary aggregates cash and non-cash sales', () => {
  const orders: Order[] = [
    {
      id: 'o1',
      orderNumber: '#1',
      timestamp: '10:00',
      serviceType: 'dine_in',
      items: [],
      subtotal: 50000,
      voucherDiscount: 0,
      tax: 5000,
      total: 55000,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      baristaStatus: 'completed',
      cupsAddedToLoyalty: 1,
      earnedNewVoucher: false,
    },
    {
      id: 'o2',
      orderNumber: '#2',
      timestamp: '10:15',
      serviceType: 'takeaway',
      items: [],
      subtotal: 30000,
      voucherDiscount: 0,
      tax: 3000,
      total: 33000,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      baristaStatus: 'completed',
      cupsAddedToLoyalty: 1,
      earnedNewVoucher: false,
    },
  ];

  const summary = calculateCashSessionSummary(200000, orders);
  assert.equal(summary.startingCash, 200000);
  assert.equal(summary.totalCashSales, 55000);
  assert.equal(summary.totalNonCashSales, 33000);
  assert.equal(summary.totalSales, 88000);
  assert.equal(summary.expectedDrawerCash, 255000);
});

