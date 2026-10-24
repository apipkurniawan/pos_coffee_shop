import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Member, OrderItem, PaymentMethod, ServiceType } from '../types/pos';
import { calculateCashPayment, calculateOrderTotals, formatRupiah } from '../utils/posLogic';

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  voucherApplied: boolean;
  selectedMember: Member | null;
  serviceType: ServiceType;
  tableNumber: string;
  takeawayName: string;
  onCompletePayment: (paymentDetails: {
    paymentMethod: PaymentMethod;
    cashReceived?: number;
    cashChange?: number;
  }) => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  voucherApplied,
  selectedMember,
  serviceType,
  tableNumber,
  takeawayName,
  onCompletePayment,
}) => {
  if (!isOpen) return null;

  const totals = calculateOrderTotals(items, voucherApplied, 0.1);
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [cashInput, setCashInput] = useState<string>(totals.total.toString());
  const [qrisPaid, setQrisPaid] = useState<boolean>(false);
  const [cardTraceNo, setCardTraceNo] = useState<string>('TRC-8921');
  const [paymentFailedNotice, setPaymentFailedNotice] = useState<string | null>(null);

  const numericCash = parseInt(cashInput.replace(/[^0-9]/g, ''), 10) || 0;
  const cashResult = calculateCashPayment(totals.total, numericCash);

  const handleQuickCash = (amount: number) => {
    setCashInput(amount.toString());
    setPaymentFailedNotice(null);
  };

  const handleProcessPayment = () => {
    setPaymentFailedNotice(null);

    if (method === 'cash') {
      if (!cashResult.isPaid) {
        // Corresponds to Node H in user flow: "Pembayaran gagal atau belum lunas"
        setPaymentFailedNotice(
          `Pembayaran belum lunas! Uang diterima ${formatRupiah(numericCash)} kurang ${formatRupiah(cashResult.deficit)}.`
        );
        return;
      }
      onCompletePayment({
        paymentMethod: 'cash',
        cashReceived: numericCash,
        cashChange: cashResult.change,
      });
    } else if (method === 'qris') {
      if (!qrisPaid) {
        setPaymentFailedNotice('Menunggu konfirmasi scan QRIS dari pelanggan.');
        return;
      }
      onCompletePayment({
        paymentMethod: 'qris',
      });
    } else {
      // Card / Ewallet
      onCompletePayment({
        paymentMethod: method,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#B86F4B] font-bold">
              Kasir Pembayaran
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B1D18]">
              Penyelesaian Transaksi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#74665D] hover:text-[#2B1D18] hover:bg-[#E7DED6]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Tagihan Ringkasan Banner */}
          <div className="p-4 rounded-xl bg-[#2B1D18] text-white flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs text-[#F2E3D9]/80">
                {serviceType === 'dine_in'
                  ? `Dine-in · ${tableNumber || 'Meja'}`
                  : `Takeaway · ${takeawayName || 'Pelanggan'}`}
                {selectedMember && ` · Member: ${selectedMember.name}`}
              </div>
              <div className="text-xs text-[#F2E3D9]/60 mt-0.5">
                {items.reduce((s, i) => s + i.quantity, 0)} item
                {voucherApplied && totals.voucherDiscount > 0 && ' (Diskon 1 Cup Gratis)'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#F2E3D9]/70 block">Total Tagihan</span>
              <span className="text-xl sm:text-2xl font-bold numeric text-[#F2E3D9]">
                {formatRupiah(totals.total)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold text-[#2B1D18] mb-2 block">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('cash');
                  setPaymentFailedNotice(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  method === 'cash'
                    ? 'bg-[#4A3027] text-white border-[#4A3027] shadow-xs'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400" />
                <span>Tunai / Cash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('qris');
                  setPaymentFailedNotice(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  method === 'qris'
                    ? 'bg-[#4A3027] text-white border-[#4A3027] shadow-xs'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>QRIS Dinamis</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('card');
                  setPaymentFailedNotice(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  method === 'card'
                    ? 'bg-[#4A3027] text-white border-[#4A3027] shadow-xs'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Kartu / EDC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('ewallet');
                  setPaymentFailedNotice(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  method === 'ewallet'
                    ? 'bg-[#4A3027] text-white border-[#4A3027] shadow-xs'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <Smartphone className="w-5 h-5 text-purple-400" />
                <span>E-Wallet</span>
              </button>
            </div>
          </div>

          {/* Conditional Method Form */}
          {method === 'cash' && (
            <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2B1D18]">
                  Nominal Uang Diterima (Rp)
                </label>
                <input
                  type="text"
                  value={cashInput}
                  onChange={(e) => {
                    setCashInput(e.target.value);
                    setPaymentFailedNotice(null);
                  }}
                  className="w-full px-3 py-2 text-base font-bold bg-white border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B86F4B] text-[#2B1D18] numeric"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickCash(totals.total)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2E3D9] border border-[#E7DED6] text-xs font-semibold rounded-lg text-[#2B1D18]"
                >
                  Uang Pas ({formatRupiah(totals.total)})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(50000)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2E3D9] border border-[#E7DED6] text-xs font-semibold rounded-lg text-[#2B1D18] numeric"
                >
                  Rp50.000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(100000)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2E3D9] border border-[#E7DED6] text-xs font-semibold rounded-lg text-[#2B1D18] numeric"
                >
                  Rp100.000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(200000)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2E3D9] border border-[#E7DED6] text-xs font-semibold rounded-lg text-[#2B1D18] numeric"
                >
                  Rp200.000
                </button>
              </div>

              {/* Live Status Calculation */}
              <div className="pt-2 border-t border-[#E7DED6] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#74665D]">Status Pembayaran</span>
                {cashResult.isPaid ? (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#21865B] flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Lunas
                    </span>
                    <div className="text-xs text-[#2B1D18] font-bold numeric">
                      Kembalian: {formatRupiah(cashResult.change)}
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#B42318] flex items-center gap-1 justify-end">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Belum Lunas
                    </span>
                    <div className="text-xs text-[#B42318] font-bold numeric">
                      Kurang: {formatRupiah(cashResult.deficit)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {method === 'qris' && (
            <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] flex flex-col items-center text-center space-y-3">
              <div className="text-xs font-semibold text-[#2B1D18]">
                Scan QRIS Karsa Coffee
              </div>
              {/* Dynamic QR Box simulation */}
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-[#E7DED6] shadow-inner flex flex-col items-center justify-center relative">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-[#FAF7F3] rounded border border-dashed border-[#B86F4B]/50">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-[#2B1D18]'
                          : 'bg-[#E7DED6]'
                      }`}
                    />
                  ))}
                </div>
                {qrisPaid && (
                  <div className="absolute inset-0 bg-[#21865B]/90 rounded-xl flex flex-col items-center justify-center text-white p-2">
                    <CheckCircle2 className="w-10 h-10 mb-1" />
                    <span className="text-xs font-bold">QRIS Terverifikasi</span>
                    <span className="text-[10px]">Pembayaran Diterima</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-[#74665D]">
                Total: <span className="font-bold text-[#2B1D18] numeric">{formatRupiah(totals.total)}</span> · Valid 5 menit
              </div>

              <button
                type="button"
                onClick={() => {
                  setQrisPaid(!qrisPaid);
                  setPaymentFailedNotice(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  qrisPaid
                    ? 'bg-[#E7F5ED] text-[#21865B] border border-[#21865B]'
                    : 'bg-[#21865B] text-white hover:bg-[#1a6e4a]'
                }`}
              >
                {qrisPaid ? '✓ Simulasi Berhasil (Klik untuk Reset)' : 'Simulasikan Scan & Bayar Sukses'}
              </button>
            </div>
          )}

          {method === 'card' && (
            <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-3">
              <div className="text-xs font-semibold text-[#2B1D18]">Mesin EDC & Kartu Debit/Kredit</div>
              <div className="grid grid-cols-3 gap-2">
                {['BCA', 'Mandiri', 'BRI'].map((bank) => (
                  <div
                    key={bank}
                    className="p-2.5 bg-white border border-[#E7DED6] rounded-lg text-center text-xs font-bold text-[#2B1D18]"
                  >
                    EDC {bank}
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#74665D] mb-1 block">
                  Nomor Approval / Trace ID
                </label>
                <input
                  type="text"
                  value={cardTraceNo}
                  onChange={(e) => setCardTraceNo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
                />
              </div>
            </div>
          )}

          {method === 'ewallet' && (
            <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
              <div className="text-xs font-semibold text-[#2B1D18]">Pilih Dompet Digital</div>
              <div className="grid grid-cols-3 gap-2">
                {['GoPay', 'OVO', 'ShopeePay'].map((ew) => (
                  <div
                    key={ew}
                    className="p-2.5 bg-white border border-[#E7DED6] rounded-lg text-center text-xs font-bold text-[#2B1D18] hover:border-[#B86F4B] cursor-pointer"
                  >
                    {ew}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Node H / Error Feedback Message */}
          {paymentFailedNotice && (
            <div className="p-3 rounded-xl bg-[#FCEAE8] border border-[#B42318]/30 text-xs text-[#B42318] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{paymentFailedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickCash(totals.total)}
                className="px-2.5 py-1 bg-white rounded border border-[#B42318]/30 font-semibold text-[11px] hover:bg-[#FCEAE8] shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Lengkapi
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#74665D] hover:bg-[#E7DED6]/50 rounded-xl"
          >
            Kembali
          </button>

          <button
            type="button"
            onClick={handleProcessPayment}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-xl shadow-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Konfirmasi Pembayaran Lunas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
