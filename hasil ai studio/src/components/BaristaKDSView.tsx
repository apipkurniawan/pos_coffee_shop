import React from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';
import { BaristaStatus, Order } from '../types/pos';

interface BaristaKDSViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: BaristaStatus) => void;
}

export const BaristaKDSView: React.FC<BaristaKDSViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const queuedOrders = orders.filter((o) => o.baristaStatus === 'queued');
  const preparingOrders = orders.filter((o) => o.baristaStatus === 'preparing');
  const readyOrders = orders.filter((o) => o.baristaStatus === 'ready');
  const completedOrders = orders.filter((o) => o.baristaStatus === 'completed');

  return (
    <div className="space-y-4">
      {/* KDS Header summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E7DED6]">
        <div>
          <h2 className="text-base font-bold text-[#2B1D18] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#B86F4B]" />
            Kitchen Display System (KDS) — Barista Station
          </h2>
          <p className="text-xs text-[#74665D]">
            Pantau antrean pesanan, status peracikan, dan instruksi penyajian Dine-in vs Takeaway.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#FAF7F3] border border-[#E7DED6] rounded-lg text-[#74665D]">
            Aktif: <strong className="text-[#2B1D18] numeric">{queuedOrders.length + preparingOrders.length + readyOrders.length}</strong>
          </span>
          <span className="px-2.5 py-1 bg-[#E7F5ED] border border-[#21865B]/30 rounded-lg text-[#21865B]">
            Selesai: <strong className="numeric">{completedOrders.length}</strong>
          </span>
        </div>
      </div>

      {/* 3-Column KanBan for Barista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kolom 1: Menunggu / Queued */}
        <div className="flex flex-col gap-3 bg-[#FAF7F3] p-3 rounded-2xl border border-[#E7DED6]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8A5200]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2B1D18]">
                Menunggu Antrean
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-[#FFF3D9] text-[#8A5200] font-bold rounded-full text-xs numeric">
              {queuedOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {queuedOrders.length > 0 ? (
              queuedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#E7DED6] p-3.5 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F3]">
                    <span className="font-bold text-sm text-[#2B1D18] numeric">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#74665D] numeric flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.timestamp}
                    </span>
                  </div>

                  {/* Destination Tag */}
                  <div className="flex items-center gap-1.5">
                    {order.serviceType === 'dine_in' ? (
                      <span className="px-2 py-0.5 bg-[#EAF3FC] text-[#2768A8] text-[11px] font-semibold rounded-md flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" />
                        {order.tableNumber || 'Dine-in'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#FAF7F3] border border-[#E7DED6] text-[#74665D] text-[11px] font-semibold rounded-md flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        Takeaway: {order.takeawayName || 'Pelanggan'}
                      </span>
                    )}
                  </div>

                  {/* Item recipes & customization */}
                  <div className="space-y-1.5 py-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="font-semibold text-[#2B1D18]">
                          {item.quantity}x {item.name}
                        </div>
                        {item.customization && (
                          <div className="text-[10px] text-[#74665D] pl-3 border-l-2 border-[#E7DED6] mt-0.5">
                            {[
                              item.customization.temperature?.toUpperCase(),
                              item.customization.size ? (item.customization.size === 'large' ? 'LARGE 12oz' : 'REG 8oz') : null,
                              item.customization.sugar === 'less' ? 'LESS SUGAR' : item.customization.sugar === 'none' ? 'NO SUGAR' : null,
                              item.customization.milk ? `${item.customization.milk.toUpperCase()} MILK` : null,
                              item.customization.extraShot ? '+EXTRA SHOT' : null,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                            {item.customization.notes && (
                              <div className="text-[#B86F4B] italic">"{item.customization.notes}"</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                    className="w-full py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-200" />
                    <span>Mulai Racik</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#74665D] bg-white rounded-xl border border-dashed border-[#E7DED6]">
                Tidak ada pesanan antrean baru.
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Diracik / Preparing */}
        <div className="flex flex-col gap-3 bg-[#FAF7F3] p-3 rounded-2xl border border-[#E7DED6]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#B86F4B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2B1D18]">
                Sedang Diracik
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-[#F2E3D9] text-[#B86F4B] font-bold rounded-full text-xs numeric">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length > 0 ? (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border-2 border-[#B86F4B] p-3.5 shadow-sm flex flex-col gap-2.5 relative"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F3]">
                    <span className="font-bold text-sm text-[#2B1D18] numeric">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-[#B86F4B] bg-[#F2E3D9] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#B86F4B]" />
                      Peracikan
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {order.serviceType === 'dine_in' ? (
                      <span className="px-2 py-0.5 bg-[#EAF3FC] text-[#2768A8] text-[11px] font-semibold rounded-md flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" />
                        {order.tableNumber || 'Dine-in'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#FAF7F3] border border-[#E7DED6] text-[#74665D] text-[11px] font-semibold rounded-md flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        Takeaway: {order.takeawayName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 py-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="font-semibold text-[#2B1D18]">
                          {item.quantity}x {item.name}
                        </div>
                        {item.customization && (
                          <div className="text-[10px] text-[#74665D] pl-3 border-l-2 border-[#B86F4B]/50 mt-0.5">
                            {[
                              item.customization.temperature?.toUpperCase(),
                              item.customization.size ? (item.customization.size === 'large' ? 'LARGE 12oz' : 'REG 8oz') : null,
                              item.customization.sugar === 'less' ? 'LESS SUGAR' : item.customization.sugar === 'none' ? 'NO SUGAR' : null,
                              item.customization.milk ? `${item.customization.milk.toUpperCase()} MILK` : null,
                              item.customization.extraShot ? '+EXTRA SHOT' : null,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                            {item.customization.notes && (
                              <div className="text-[#B86F4B] italic">"{item.customization.notes}"</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                    className="w-full py-2 bg-[#21865B] hover:bg-[#1a6e4a] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Pesanan Siap</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#74665D] bg-white rounded-xl border border-dashed border-[#E7DED6]">
                Tidak ada pesanan yang sedang diracik.
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Pesanan Siap (Ready) -> Layanan Instruksi */}
        <div className="flex flex-col gap-3 bg-[#FAF7F3] p-3 rounded-2xl border border-[#E7DED6]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#21865B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2B1D18]">
                Pesanan Siap Sajikan
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-[#E7F5ED] text-[#21865B] font-bold rounded-full text-xs numeric">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length > 0 ? (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#21865B]/40 p-3.5 shadow-2xs flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F3]">
                    <span className="font-bold text-sm text-[#2B1D18] numeric">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-[#21865B] bg-[#E7F5ED] px-2 py-0.5 rounded-full">
                      Siap
                    </span>
                  </div>

                  {/* Flowchart Node SD vs ST Instruction Display */}
                  <div className="p-2.5 rounded-lg bg-[#FAF7F3] border border-[#E7DED6]">
                    <div className="text-[10px] uppercase font-bold text-[#74665D]">
                      Instruksi Pelayanan:
                    </div>
                    {order.serviceType === 'dine_in' ? (
                      <div className="text-xs font-bold text-[#2768A8] flex items-center gap-1.5 mt-0.5">
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Sajikan ke meja pelanggan: {order.tableNumber || 'Meja Pelanggan'}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-[#B86F4B] flex items-center gap-1.5 mt-0.5">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Kemas & serahkan saat diambil: {order.takeawayName || 'Pemesan'}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-[#74665D]">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} item pesanan siap dinikmati.
                  </div>

                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                    className="w-full py-2 bg-[#2B1D18] hover:bg-[#4A3027] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {order.serviceType === 'dine_in' ? 'Selesai Disajikan' : 'Selesai Diambil'}
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#74665D] bg-white rounded-xl border border-dashed border-[#E7DED6]">
                Tidak ada pesanan yang menunggu disajikan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
