import React, { useRef } from 'react';
import { X, Printer, CheckCircle, Gift, Sparkles, Plus, Copy } from 'lucide-react';
import { Order } from '../types/pos';
import { formatRupiah } from '../utils/posLogic';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onNewOrder }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `KARSA COFFEE - Struk #${order.orderNumber}
Waktu: ${order.timestamp}
Layanan: ${order.serviceType === 'dine_in' ? `Dine-in (${order.tableNumber})` : `Takeaway (${order.takeawayName})`}
${order.memberName ? `Member: ${order.memberName} (${order.memberPhone})` : ''}
Items:
${order.items.map((i) => `- ${i.quantity}x ${i.name}: ${formatRupiah(i.unitPrice * i.quantity)}`).join('\n')}
Total: ${formatRupiah(order.total)} (${order.paymentMethod.toUpperCase()})
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#21865B] font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Pembayaran Lunas & Tercatat</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#74665D] hover:text-[#2B1D18]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Celebration Banner if earned new voucher */}
        {order.earnedNewVoucher && (
          <div className="bg-gradient-to-r from-[#B86F4B] to-[#684536] text-white p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Voucher Gratis 1 Cup Berhasil Diterbitkan!
              </div>
              <p className="text-[11px] text-[#F2E3D9]/90 mt-0.5">
                Member telah mencapai 10 cup. Voucher otomatis tersimpan di akun loyalty.
              </p>
            </div>
          </div>
        )}

        {/* Receipt Body (Designed like a clean thermal receipt) */}
        <div className="p-6 overflow-y-auto bg-[#FAF7F3]">
          <div
            ref={receiptRef}
            className="bg-white p-5 rounded-xl border border-[#E7DED6] shadow-2xs font-mono text-xs text-[#2B1D18] space-y-3"
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-[#E7DED6]">
              <h2 className="text-base font-bold tracking-wider font-sans text-[#2B1D18]">
                KARSA COFFEE
              </h2>
              <p className="text-[10px] text-[#74665D]">Jl. Senopati No. 42, Jakarta Selatan</p>
              <div className="mt-2 text-sm font-bold text-[#B86F4B] numeric">
                ORDER NO: {order.orderNumber}
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-1 text-[11px] text-[#74665D] pb-2 border-b border-dashed border-[#E7DED6]">
              <div className="flex justify-between">
                <span>Waktu Transaksi</span>
                <span className="numeric text-[#2B1D18]">{order.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>Layanan</span>
                <span className="font-semibold text-[#2B1D18]">
                  {order.serviceType === 'dine_in'
                    ? `Dine-in (${order.tableNumber})`
                    : `Takeaway (${order.takeawayName})`}
                </span>
              </div>
              {order.memberName && (
                <div className="flex justify-between">
                  <span>Pelanggan Member</span>
                  <span className="font-semibold text-[#2B1D18]">
                    {order.memberName} ({order.memberPhone})
                  </span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 py-2 border-b border-dashed border-[#E7DED6]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <div className="font-semibold text-[#2B1D18]">
                      {item.quantity}x {item.name}
                    </div>
                    {item.customization && (
                      <div className="text-[10px] text-[#74665D]">
                        {[
                          item.customization.temperature,
                          item.customization.size ? (item.customization.size === 'large' ? 'Large 12oz' : 'Reg 8oz') : null,
                          item.customization.milk ? `${item.customization.milk} milk` : null,
                          item.customization.extraShot ? '+shot' : null,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0 numeric font-semibold text-[#2B1D18]">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-[#74665D]">
                <span>Subtotal</span>
                <span className="numeric text-[#2B1D18]">{formatRupiah(order.subtotal)}</span>
              </div>

              {order.voucherDiscount > 0 && (
                <div className="flex justify-between text-[#21865B] font-semibold">
                  <span>Diskon Voucher 1 Cup</span>
                  <span className="numeric">-{formatRupiah(order.voucherDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#74665D]">
                <span>Pajak Restoran (PB1 10%)</span>
                <span className="numeric text-[#2B1D18]">{formatRupiah(order.tax)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E7DED6] text-[#2B1D18]">
                <span>TOTAL AKHIR</span>
                <span className="numeric text-base text-[#B86F4B]">
                  {formatRupiah(order.total)}
                </span>
              </div>

              <div className="flex justify-between text-[#74665D] pt-1">
                <span>Metode Pembayaran</span>
                <span className="uppercase font-semibold text-[#2B1D18]">
                  {order.paymentMethod} (Lunas)
                </span>
              </div>

              {order.paymentMethod === 'cash' && order.cashReceived && (
                <>
                  <div className="flex justify-between text-[#74665D]">
                    <span>Tunai Diterima</span>
                    <span className="numeric text-[#2B1D18]">
                      {formatRupiah(order.cashReceived)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2B1D18] font-bold">
                    <span>Kembalian</span>
                    <span className="numeric">{formatRupiah(order.cashChange || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Loyalty footer note on receipt */}
            {order.memberName && (
              <div className="pt-3 border-t border-dashed border-[#E7DED6] text-center text-[10px] text-[#74665D]">
                <p>Stamp Pembelian: +{order.cupsAddedToLoyalty} cup berbayar</p>
                <p className="font-semibold text-[#B86F4B]">Terima kasih atas kunjungan Anda!</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 border-t border-[#E7DED6] bg-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] rounded-xl border border-[#E7DED6] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#B86F4B]" />
              <span>Cetak Struk</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] rounded-xl border border-[#E7DED6] flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#74665D]" />
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>

          <button
            onClick={onNewOrder}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
