import React, { useState } from 'react';
import {
  INITIAL_CASH_SESSION,
  INITIAL_INVENTORY,
  INITIAL_MEMBERS,
  INITIAL_RECENT_ORDERS,
  INITIAL_TABLES,
  INITIAL_USERS,
  INITIAL_VOUCHERS_MASTER,
  MENU_ITEMS,
  STORE_SETTINGS,
} from './data/mockData';
import {
  AppUser,
  CashSession,
  InventoryItem,
  Member,
  MenuItem,
  Order,
  OrderItem,
  PaymentMethod,
  ServiceType,
  StoreSettings,
  TableItem,
  Voucher,
  BaristaStatus,
} from './types/pos';
import {
  calculateLoyaltyProgress,
  calculateOrderTotals,
  countPaidBeverageCups,
  deductInventoryStock,
} from './utils/posLogic';
import { Header } from './components/Header';
import { NavigationSidebar, MainNavRoute } from './components/NavigationSidebar';
import { CustomerServiceSelector } from './components/CustomerServiceSelector';
import { MenuCatalog } from './components/MenuCatalog';
import { CartSummary } from './components/CartSummary';
import { CheckoutPaymentModal } from './components/CheckoutPaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { BaristaKDSView } from './components/BaristaKDSView';
import { MemberManagementView } from './components/MemberManagementView';
import { InventoryView } from './components/InventoryView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { DashboardView } from './components/DashboardView';
import { CashSessionView } from './components/CashSessionView';
import { TablesManagementView } from './components/TablesManagementView';
import { MenuManagementView } from './components/MenuManagementView';
import { VouchersView } from './components/VouchersView';
import { ReportsView } from './components/ReportsView';
import { StoreSettingsView } from './components/StoreSettingsView';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

export default function App() {
  // Navigation & Role State
  const [currentRoute, setCurrentRoute] = useState<MainNavRoute>('pos');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[2]); // Budi (Kasir) by default

  // Operational & Catalog State
  const [cashSession, setCashSession] = useState<CashSession>(INITIAL_CASH_SESSION);
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS_MASTER);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(STORE_SETTINGS);

  // Cart & POS Order State
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<Member | null>(INITIAL_MEMBERS[0]); // default to Budi for demo ease
  const [serviceType, setServiceType] = useState<ServiceType>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('Meja 04');
  const [takeawayName, setTakeawayName] = useState<string>('Bpk Budi');
  const [voucherApplied, setVoucherApplied] = useState<boolean>(false);
  const [activeVoucherUsed, setActiveVoucherUsed] = useState<Voucher | undefined>(undefined);

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [orders, setOrders] = useState<Order[]>(INITIAL_RECENT_ORDERS);
  const [orderCounter, setOrderCounter] = useState<number>(41);

  // Modals state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Cart Management
  const handleAddToCart = (newItem: OrderItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          JSON.stringify(i.customization) === JSON.stringify(newItem.customization)
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + newItem.quantity,
        };
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setVoucherApplied(false);
    setActiveVoucherUsed(undefined);
  };

  // Member Registration
  const handleRegisterMember = (name: string, phone: string): Member => {
    const newMember: Member = {
      id: `mbr-${Date.now()}`,
      name,
      phone,
      cupProgress: 0,
      totalLifetimeCups: 0,
      vouchers: [],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [newMember, ...prev]);
    setSelectedMember(newMember);
    setVoucherApplied(false);
    return newMember;
  };

  const handleToggleVoucher = (apply: boolean, voucher?: Voucher) => {
    setVoucherApplied(apply);
    setActiveVoucherUsed(apply ? voucher : undefined);
  };

  // Checkout Completion (Post-Payment Orchestrator)
  const handleCompletePayment = (paymentDetails: {
    paymentMethod: PaymentMethod;
    cashReceived?: number;
    cashChange?: number;
  }) => {
    const taxRate = (storeSettings.taxPercent || 10) / 100;
    const totals = calculateOrderTotals(cartItems, voucherApplied, taxRate);
    const paidCups = countPaidBeverageCups(cartItems, voucherApplied);

    let earnedNewVoucher = false;

    // 1. Process Member Loyalty & 10-Cup Milestone (Node LM, LC, LT, LV, LP)
    if (selectedMember) {
      const loyaltyResult = calculateLoyaltyProgress(selectedMember.cupProgress, paidCups);
      let updatedVouchers = [...selectedMember.vouchers];

      // Mark applied voucher as used if applicable
      if (voucherApplied && activeVoucherUsed) {
        updatedVouchers = updatedVouchers.map((v) =>
          v.id === activeVoucherUsed.id ? { ...v, status: 'used' as const } : v
        );
      }

      // If reached 10 cups milestone, issue new voucher(s)
      if (loyaltyResult.vouchersEarned > 0) {
        earnedNewVoucher = true;
        for (let i = 0; i < loyaltyResult.vouchersEarned; i++) {
          const newVoucher: Voucher = {
            id: `vch-${Date.now()}-${i}`,
            code: `KARSA-FREE-${Math.floor(100 + Math.random() * 900)}`,
            title: 'Gratis 1 Cup Minuman Bebas',
            description: 'Hadiah reward milestone 10 cup pembelian.',
            discountType: 'free_cup',
            status: 'available',
            expiryDate: '2026-12-31',
          };
          updatedVouchers.push(newVoucher);
        }
      }

      const updatedMember: Member = {
        ...selectedMember,
        cupProgress: loyaltyResult.newProgress,
        totalLifetimeCups: selectedMember.totalLifetimeCups + paidCups,
        vouchers: updatedVouchers,
      };

      setSelectedMember(updatedMember);
      setMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    }

    // 2. Deduct Ingredient Stock According to Recipes (Node I)
    const ingredientUsageList: { ingredientId: string; amount: number }[] = [];
    for (const cartItem of cartItems) {
      const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
      if (menuItem?.recipe) {
        for (const ingredient of menuItem.recipe) {
          ingredientUsageList.push({
            ingredientId: ingredient.ingredientId,
            amount: ingredient.amount * cartItem.quantity,
          });
        }
      }
    }
    const updatedInventory = deductInventoryStock(inventory, ingredientUsageList);
    setInventory(updatedInventory);

    // 3. Create Final Order Record & Send to Barista Queue (Node G, K)
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const orderNum = `#K-0${orderCounter}`;
    setOrderCounter((prev) => prev + 1);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      timestamp: timeString,
      serviceType,
      tableNumber: serviceType === 'dine_in' ? tableNumber : undefined,
      takeawayName: serviceType === 'takeaway' ? takeawayName : undefined,
      memberId: selectedMember?.id,
      memberName: selectedMember?.name,
      memberPhone: selectedMember?.phone,
      items: [...cartItems],
      subtotal: totals.subtotal,
      voucherDiscount: totals.voucherDiscount,
      voucherUsedId: activeVoucherUsed?.id,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: paymentDetails.paymentMethod,
      paymentStatus: 'paid',
      cashReceived: paymentDetails.cashReceived,
      cashChange: paymentDetails.cashChange,
      baristaStatus: 'queued', // enters Barista station queue
      cupsAddedToLoyalty: paidCups,
      earnedNewVoucher,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // 4. Mark Dine-in table as occupied if applicable
    if (serviceType === 'dine_in') {
      setTables((prev) =>
        prev.map((t) =>
          t.number === tableNumber
            ? { ...t, status: 'occupied', activeOrderNumber: orderNum }
            : t
        )
      );
    }

    // Reset current cart
    setCartItems([]);
    setVoucherApplied(false);
    setActiveVoucherUsed(undefined);
    setIsCheckoutModalOpen(false);

    // Open Thermal Receipt Modal
    setActiveReceiptOrder(newOrder);
  };

  // Barista status progression
  const handleUpdateOrderStatus = (orderId: string, newStatus: BaristaStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, baristaStatus: newStatus } : ord))
    );
  };

  // Restock inventory
  const handleRestock = (itemId: string, addAmount: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, currentStock: item.currentStock + addAmount } : item
      )
    );
  };

  // Cash Session Management
  const handleCloseCashSession = (actualCash: number, notes: string) => {
    const paidCashOrders = orders.filter(
      (o) => o.paymentStatus === 'paid' && o.paymentMethod === 'cash'
    );
    const totalCashSales = paidCashOrders.reduce((sum, o) => sum + o.total, 0);
    const expected = cashSession.startingCash + totalCashSales;

    setCashSession((prev) => ({
      ...prev,
      actualCash,
      expectedCash: expected,
      difference: actualCash - expected,
      closedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'closed',
      notes: notes || prev.notes,
    }));
  };

  const handleOpenNewCashSession = (cashierName: string, startingCash: number) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setCashSession({
      id: `ses-${Date.now()}`,
      cashierName,
      openedAt: nowTime,
      startingCash,
      expectedCash: startingCash,
      status: 'open',
      notes: `Sesi dibuka pada ${nowTime} oleh ${cashierName}`,
    });
  };

  // Table Management
  const handleSelectTableForPOS = (tableNum: string) => {
    setServiceType('dine_in');
    setTableNumber(tableNum);
    setCurrentRoute('pos');
  };

  const handleUpdateTableStatus = (
    tableId: string,
    status: 'available' | 'occupied' | 'reserved'
  ) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status, activeOrderNumber: status === 'available' ? undefined : t.activeOrderNumber }
          : t
      )
    );
  };

  // Menu Catalog Management
  const handleToggleMenuAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === updatedItem.id ? updatedItem : m)));
  };

  // Voucher Creation
  const handleCreateVoucher = (newVoucher: Voucher) => {
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  // Active Barista Queue Count
  const activeBaristaOrdersCount = orders.filter(
    (o) => o.baristaStatus === 'queued' || o.baristaStatus === 'preparing'
  ).length;

  const navigateTo = (route: MainNavRoute) => {
    if (route === 'diagram') {
      setIsArchitectureModalOpen(true);
      return;
    }
    setCurrentRoute(route);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex text-[#2B1D18] font-sans selection:bg-[#B86F4B]/20">
      {/* Desktop Sidebar (Persistent 260px) */}
      <div className="hidden lg:block shrink-0">
        <NavigationSidebar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          currentUser={currentUser}
          onChangeUser={setCurrentUser}
          activeOrderCount={activeBaristaOrdersCount}
          isCashSessionOpen={cashSession.status === 'open'}
          onNewOrder={() => {
            setCurrentRoute('pos');
            handleClearCart();
          }}
        />
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            <NavigationSidebar
              currentRoute={currentRoute}
              onNavigate={navigateTo}
              currentUser={currentUser}
              onChangeUser={setCurrentUser}
              activeOrderCount={activeBaristaOrdersCount}
              isCashSessionOpen={cashSession.status === 'open'}
              onNewOrder={() => {
                setCurrentRoute('pos');
                handleClearCart();
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          activeOrderCount={activeBaristaOrdersCount}
          isCashSessionOpen={cashSession.status === 'open'}
          currentUser={currentUser}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNewTransaction={() => {
            setCurrentRoute('pos');
            handleClearCart();
          }}
          onOpenFlowModal={() => setIsArchitectureModalOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          {/* ROUTE 1: DASHBOARD RINGKAS */}
          {currentRoute === 'dashboard' && (
            <DashboardView
              orders={orders}
              menuItems={menuItems}
              inventory={inventory}
              cashSession={cashSession}
              onNavigate={navigateTo}
            />
          )}

          {/* ROUTE 2: KASIR & POS (Utama) */}
          {currentRoute === 'pos' && (
            <div className="space-y-4">
              {/* Step 1 & 2: Customer Identity & Service Selector Bar */}
              <CustomerServiceSelector
                members={members}
                selectedMember={selectedMember}
                onSelectMember={(m) => {
                  setSelectedMember(m);
                  setVoucherApplied(false);
                }}
                onRegisterMember={handleRegisterMember}
                serviceType={serviceType}
                onChangeServiceType={setServiceType}
                tableNumber={tableNumber}
                onChangeTableNumber={setTableNumber}
                takeawayName={takeawayName}
                onChangeTakeawayName={setTakeawayName}
                voucherApplied={voucherApplied}
                onToggleVoucher={handleToggleVoucher}
              />

              {/* Split Grid: Catalog (8 cols) + Order Cart Summary (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8">
                  <MenuCatalog items={menuItems} onQuickAddItem={handleAddToCart} />
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-20">
                  <CartSummary
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    selectedMember={selectedMember}
                    voucherApplied={voucherApplied}
                    onToggleVoucher={handleToggleVoucher}
                    serviceType={serviceType}
                    tableNumber={tableNumber}
                    takeawayName={takeawayName}
                    onOpenCheckout={() => setIsCheckoutModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ROUTE 3: ANTREAN BARISTA (KDS) */}
          {currentRoute === 'kds' && (
            <BaristaKDSView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
          )}

          {/* ROUTE 4: SESI KASIR (SHIFT) */}
          {currentRoute === 'cash_session' && (
            <CashSessionView
              session={cashSession}
              orders={orders}
              onCloseSession={handleCloseCashSession}
              onOpenNewSession={handleOpenNewCashSession}
            />
          )}

          {/* ROUTE 5: MANAJEMEN MEJA */}
          {currentRoute === 'tables' && (
            <TablesManagementView
              tables={tables}
              onSelectTableForPOS={handleSelectTableForPOS}
              onUpdateTableStatus={handleUpdateTableStatus}
            />
          )}

          {/* ROUTE 6: MENU & HPP */}
          {currentRoute === 'menus' && (
            <MenuManagementView
              menuItems={menuItems}
              inventory={inventory}
              onToggleAvailability={handleToggleMenuAvailability}
              onAddMenuItem={handleAddMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
            />
          )}

          {/* ROUTE 7: MEMBER & 10-CUP LOYALTY */}
          {currentRoute === 'members' && (
            <MemberManagementView
              members={members}
              onRegisterMember={handleRegisterMember}
              onSelectForOrder={(m) => {
                setSelectedMember(m);
                setCurrentRoute('pos');
              }}
            />
          )}

          {/* ROUTE 8: MANAJEMEN VOUCHER */}
          {currentRoute === 'vouchers' && (
            <VouchersView vouchers={vouchers} onCreateVoucher={handleCreateVoucher} />
          )}

          {/* ROUTE 9: STOK BAHAN & RESEP */}
          {currentRoute === 'inventory' && (
            <InventoryView inventory={inventory} onRestock={handleRestock} />
          )}

          {/* ROUTE 10: RIWAYAT TRANSAKSI */}
          {currentRoute === 'history' && (
            <OrderHistoryView
              orders={orders}
              onViewReceipt={(order) => setActiveReceiptOrder(order)}
            />
          )}

          {/* ROUTE 11: LAPORAN PENJUALAN */}
          {currentRoute === 'reports' && <ReportsView orders={orders} />}

          {/* ROUTE 12: PENGATURAN KEDAI */}
          {currentRoute === 'settings' && (
            <StoreSettingsView
              settings={storeSettings}
              onUpdateSettings={setStoreSettings}
            />
          )}
        </main>
      </div>

      {/* MODAL 1: Payment Checkout */}
      <CheckoutPaymentModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={cartItems}
        voucherApplied={voucherApplied}
        selectedMember={selectedMember}
        serviceType={serviceType}
        tableNumber={tableNumber}
        takeawayName={takeawayName}
        onCompletePayment={handleCompletePayment}
      />

      {/* MODAL 2: Struk Cetak Digital */}
      <ReceiptModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        onNewOrder={() => {
          setActiveReceiptOrder(null);
          handleClearCart();
          setCurrentRoute('pos');
        }}
      />

      {/* MODAL 3: Interactive System Architecture Viewer (User Flowchart & ERD) */}
      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
