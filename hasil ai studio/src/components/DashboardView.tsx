import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Coffee,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { CashSession, InventoryItem, MenuItem, Order } from '../types/pos';
import { formatRupiah } from '../utils/posLogic';

interface DashboardViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  cashSession: CashSession;
  onNavigate: (route: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  menuItems,
  inventory,
  cashSession,
  onNavigate,
}) => {
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCups = paidOrders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.isCupBeverage).reduce((s, i) => s + i.quantity, 0),
    0
  );
  const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);
  const sortedTopMenu = [...menuItems].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  // Hourly distribution mock (08:00 - 16:00)
  const hourlyData = [
    { hour: '08:00', amount: 35000 },
    { hour: '09:00', amount: 72000 },
    { hour: '10:00', amount: 145000 },
    { hour: '11:00', amount: 98000 },
    { hour: '12:00', amount: 180000 },
    { hour: '13:00', amount: 120000 },
    { hour: '14:00', amount: 85000 },
    { hour: '15:00', amount: 64000 },
  ];
  const maxHourly = Math.max(...hourlyData.map((d) => d.amount));

  return (
    <div className="space-y-5">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Executive Overview
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18]">Dashboard Ringkas Penjualan</h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Pantau kondisi finansial kedai, performa produk, dan status antrean secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('pos')}
            className="px-4 py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span>Buka Kasir (POS)</span>
          </button>
          <button
            onClick={() => onNavigate('kds')}
            className="px-4 py-2 bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] border border-[#E7DED6] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4 text-[#B86F4B]" />
            <span>Layar Barista</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider">
            Omzet Hari Ini
          </span>
          <div className="text-2xl font-bold text-[#2B1D18] numeric my-1">
            {formatRupiah(totalRevenue)}
          </div>
          <div className="text-[11px] text-[#21865B] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% dibanding kemarin</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider">
            Total Transaksi
          </span>
          <div className="text-2xl font-bold text-[#2B1D18] numeric my-1">
            {paidOrders.length} Pesanan
          </div>
          <div className="text-[11px] text-[#74665D]">100% Pembayaran Berhasil</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider">
            Cup Terjual
          </span>
          <div className="text-2xl font-bold text-[#B86F4B] numeric my-1">
            {totalCups} Cup
          </div>
          <div className="text-[11px] text-[#74665D]">Minuman berbasis espresso & manual brew</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider">
            Rata-rata Order (AOV)
          </span>
          <div className="text-2xl font-bold text-[#2B1D18] numeric my-1">
            {formatRupiah(avgOrderValue)}
          </div>
          <div className="text-[11px] text-[#21865B] font-semibold">Sehat & di atas target</div>
        </div>
      </div>

      {/* Middle Split: Sales Trend Bar Chart + Cash Register Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Sales Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F3]">
            <div>
              <h3 className="font-bold text-sm text-[#2B1D18]">Tren Penjualan per Jam</h3>
              <p className="text-xs text-[#74665D]">Distribusi volume transaksi hari ini</p>
            </div>
            <span className="text-xs font-semibold text-[#B86F4B] bg-[#F2E3D9] px-2.5 py-1 rounded-md">
              Jam Sibuk: 12:00 - 13:00
            </span>
          </div>

          <div className="pt-2">
            <div className="h-44 flex items-end gap-3 sm:gap-4 justify-between px-2">
              {hourlyData.map((d, idx) => {
                const heightPercent = Math.round((d.amount / maxHourly) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-[#74665D] numeric hidden sm:block">
                      {Math.round(d.amount / 1000)}k
                    </span>
                    <div
                      className="w-full bg-[#B86F4B] hover:bg-[#2B1D18] rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                      title={`${d.hour}: ${formatRupiah(d.amount)}`}
                    />
                    <span className="text-[11px] font-semibold text-[#74665D] numeric mt-1">
                      {d.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sesi Kasir Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F3]">
              <h3 className="font-bold text-sm text-[#2B1D18]">Status Sesi Kasir</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#E7F5ED] text-[#21865B] font-bold text-xs">
                Sesi Aktif
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#74665D]">Kasir Bertugas:</span>
                <span className="font-bold text-[#2B1D18]">{cashSession.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74665D]">Waktu Buka Shift:</span>
                <span className="font-semibold text-[#2B1D18] numeric">{cashSession.openedAt} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74665D]">Modal Awal Laci:</span>
                <span className="font-bold text-[#2B1D18] numeric">
                  {formatRupiah(cashSession.startingCash)}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F3] rounded-xl border border-[#E7DED6] space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#74665D]">Estimasi Kas di Laci:</span>
                  <span className="font-bold text-base text-[#21865B] numeric">
                    {formatRupiah(cashSession.expectedCash)}
                  </span>
                </div>
                <p className="text-[10px] text-[#74665D]">
                  Modal awal + seluruh penerimaan tunai shift berjalan.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('cash_session')}
            className="w-full py-2 bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] text-xs font-semibold rounded-xl border border-[#E7DED6] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Kelola Sesi & Tutup Kasir</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B86F4B]" />
          </button>
        </div>
      </div>

      {/* Bottom Split: Top Selling Menu + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top 5 Products (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F3]">
            <h3 className="font-bold text-sm text-[#2B1D18]">Menu Terlaris (Top Selling)</h3>
            <button
              onClick={() => onNavigate('menus')}
              className="text-xs text-[#B86F4B] font-semibold hover:underline"
            >
              Lihat Semua Menu &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#FAF7F3]">
            {sortedTopMenu.map((m, idx) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-bold text-[#74665D] numeric">
                    #{idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-[#2B1D18]">{m.name}</h5>
                    <span className="text-[11px] text-[#74665D] capitalize">{m.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#2B1D18] numeric">{formatRupiah(m.basePrice)}</span>
                  <div className="text-[10px] text-[#21865B] font-semibold numeric">
                    {m.salesCount} terjual
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning Alert (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F3]">
              <h3 className="font-bold text-sm text-[#2B1D18] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#8A5200]" />
                Peringatan Stok Menipis
              </h3>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs text-[#B86F4B] font-semibold hover:underline"
              >
                Atur Stok &rarr;
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((ing) => (
                  <div
                    key={ing.id}
                    className="p-2.5 rounded-xl bg-[#FCEAE8] border border-[#B42318]/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#B42318]">{ing.name}</div>
                      <div className="text-[10px] text-[#74665D]">
                        Batas minimum: {ing.minThreshold} {ing.unit}
                      </div>
                    </div>
                    <span className="font-bold text-[#B42318] numeric">
                      {ing.currentStock} {ing.unit}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#E7F5ED] border border-[#21865B]/20 text-xs text-[#21865B] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Semua bahan baku utama berada pada level aman di atas ambang batas.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#74665D] border-t border-[#FAF7F3]">
            Sistem otomatis memotong stok setiap kali pesanan lunas diselesaikan di kasir.
          </div>
        </div>
      </div>
    </div>
  );
};
