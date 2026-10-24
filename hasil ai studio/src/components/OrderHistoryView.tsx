import React from 'react';
import { History, Receipt, UtensilsCrossed, ShoppingBag, Eye, Calendar, DollarSign } from 'lucide-react';
import { Order } from '../types/pos';
import { formatRupiah } from '../utils/posLogic';

interface OrderHistoryViewProps {
  orders: Order[];
  onViewReceipt: (order: Order) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, onViewReceipt }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPaidCups = orders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.isCupBeverage).reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Metric strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#74665D] uppercase tracking-wider block">
            Total Transaksi Hari Ini
          </span>
          <div className="text-2xl font-bold text-[#2B1D18] numeric mt-1">
            {orders.length} Pesanan
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#74665D] uppercase tracking-wider block">
            Total Omzet Pendapatan
          </span>
          <div className="text-2xl font-bold text-[#B86F4B] numeric mt-1">
            {formatRupiah(totalRevenue)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#74665D] uppercase tracking-wider block">
            Total Cup Terjual
          </span>
          <div className="text-2xl font-bold text-[#21865B] numeric mt-1">
            {totalPaidCups} Cup Kopi/Teh
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#FAF7F3] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#2B1D18] flex items-center gap-2">
            <History className="w-4 h-4 text-[#B86F4B]" />
            Daftar Riwayat Transaksi
          </h3>
          <span className="text-xs text-[#74665D]">Diurutkan berdasarkan transaksi terbaru</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F3] text-[#74665D] font-semibold border-b border-[#E7DED6]">
              <tr>
                <th className="py-3 px-4">No. Order</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Layanan & Pelanggan</th>
                <th className="py-3 px-4">Rincian Item</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Status Barista</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F3]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F3]/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#2B1D18] numeric">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-[#74665D] numeric">{order.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#2B1D18]">
                      {order.serviceType === 'dine_in'
                        ? order.tableNumber || 'Dine-in'
                        : `Takeaway (${order.takeawayName})`}
                    </div>
                    {order.memberName && (
                      <div className="text-[10px] text-[#B86F4B]">Member: {order.memberName}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#74665D] max-w-xs truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 uppercase font-semibold text-[#2B1D18]">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#2B1D18] numeric">
                    {formatRupiah(order.total)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.baristaStatus === 'completed'
                          ? 'bg-[#E7F5ED] text-[#21865B]'
                          : order.baristaStatus === 'ready'
                          ? 'bg-[#EAF3FC] text-[#2768A8]'
                          : order.baristaStatus === 'preparing'
                          ? 'bg-[#F2E3D9] text-[#B86F4B]'
                          : 'bg-[#FFF3D9] text-[#8A5200]'
                      }`}
                    >
                      {order.baristaStatus === 'completed'
                        ? 'Selesai'
                        : order.baristaStatus === 'ready'
                        ? 'Siap'
                        : order.baristaStatus === 'preparing'
                        ? 'Diracik'
                        : 'Antrean'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onViewReceipt(order)}
                      className="px-2.5 py-1 text-xs bg-[#FAF7F3] hover:bg-[#B86F4B] hover:text-white border border-[#E7DED6] rounded-md font-semibold text-[#2B1D18] transition-colors inline-flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Struk</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
