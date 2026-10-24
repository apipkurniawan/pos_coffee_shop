import React, { useState } from 'react';
import { BarChart3, Download, DollarSign, CreditCard, QrCode, Banknote, Calendar, PieChart } from 'lucide-react';
import { Order } from '../types/pos';
import { formatRupiah } from '../utils/posLogic';

interface ReportsViewProps {
  orders: Order[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ orders }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalGross = paidOrders.reduce((s, o) => s + o.subtotal, 0);
  const totalDiscount = paidOrders.reduce((s, o) => s + o.voucherDiscount, 0);
  const totalTax = paidOrders.reduce((s, o) => s + o.tax, 0);
  const totalNet = paidOrders.reduce((s, o) => s + o.total, 0);

  // Payment Breakdown
  const cashTotal = paidOrders.filter((o) => o.paymentMethod === 'cash').reduce((s, o) => s + o.total, 0);
  const qrisTotal = paidOrders.filter((o) => o.paymentMethod === 'qris').reduce((s, o) => s + o.total, 0);
  const cardTotal = paidOrders.filter((o) => o.paymentMethod === 'card').reduce((s, o) => s + o.total, 0);
  const ewalletTotal = paidOrders.filter((o) => o.paymentMethod === 'ewallet').reduce((s, o) => s + o.total, 0);

  const getPercent = (amount: number) => (totalNet > 0 ? Math.round((amount / totalNet) * 100) : 0);

  const [downloadNotice, setDownloadNotice] = useState(false);

  const handleExportCSV = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Financial & Sales Analytics
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#B86F4B]" />
            Laporan Penjualan & Rekap Pembayaran
          </h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Analisis pendapatan bersih, pembagian metode pembayaran, dan potongan voucher loyalitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#FAF7F3] p-1 rounded-xl border border-[#E7DED6] text-xs font-semibold">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'today' ? 'bg-[#2B1D18] text-white shadow-xs' : 'text-[#74665D]'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'week' ? 'bg-[#2B1D18] text-white shadow-xs' : 'text-[#74665D]'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'month' ? 'bg-[#2B1D18] text-white shadow-xs' : 'text-[#74665D]'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-xl bg-[#E7F5ED] border border-[#21865B]/30 text-xs text-[#21865B] font-semibold">
          ✓ Rekap penjualan harian berhasil diekspor ke format CSV (simulasi audit siap diunduh).
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider block">
            Pendapatan Bersih (Net)
          </span>
          <div className="text-2xl font-bold text-[#2B1D18] numeric mt-1">
            {formatRupiah(totalNet)}
          </div>
          <div className="text-[10px] text-[#74665D] mt-0.5">Sudah termasuk PB1 10%</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider block">
            Subtotal Penjualan (Kotor)
          </span>
          <div className="text-2xl font-bold text-[#74665D] numeric mt-1">
            {formatRupiah(totalGross)}
          </div>
          <div className="text-[10px] text-[#74665D] mt-0.5">Sebelum diskon voucher</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider block">
            Diskon Voucher Diberikan
          </span>
          <div className="text-2xl font-bold text-[#21865B] numeric mt-1">
            -{formatRupiah(totalDiscount)}
          </div>
          <div className="text-[10px] text-[#21865B] mt-0.5">Reward loyalitas 10 cup</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#74665D] uppercase tracking-wider block">
            Pajak Resto (PB1 10%)
          </span>
          <div className="text-2xl font-bold text-[#B86F4B] numeric mt-1">
            {formatRupiah(totalTax)}
          </div>
          <div className="text-[10px] text-[#74665D] mt-0.5">Wajib setor daerah</div>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-[#2B1D18] pb-2 border-b border-[#FAF7F3]">
          Komposisi Metode Pembayaran (Payment Breakdown)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#2B1D18] flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-amber-500" />
                Tunai / Cash
              </span>
              <span className="text-xs font-bold text-[#B86F4B] numeric">
                {getPercent(cashTotal)}%
              </span>
            </div>
            <div className="text-lg font-bold text-[#2B1D18] numeric">
              {formatRupiah(cashTotal)}
            </div>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${getPercent(cashTotal)}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#2B1D18] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-500" />
                QRIS Dinamis
              </span>
              <span className="text-xs font-bold text-[#21865B] numeric">
                {getPercent(qrisTotal)}%
              </span>
            </div>
            <div className="text-lg font-bold text-[#2B1D18] numeric">
              {formatRupiah(qrisTotal)}
            </div>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${getPercent(qrisTotal)}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#2B1D18] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-sky-500" />
                Kartu / EDC
              </span>
              <span className="text-xs font-bold text-[#2768A8] numeric">
                {getPercent(cardTotal)}%
              </span>
            </div>
            <div className="text-lg font-bold text-[#2B1D18] numeric">
              {formatRupiah(cardTotal)}
            </div>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${getPercent(cardTotal)}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#2B1D18] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-purple-500" />
                E-Wallet
              </span>
              <span className="text-xs font-bold text-purple-600 numeric">
                {getPercent(ewalletTotal)}%
              </span>
            </div>
            <div className="text-lg font-bold text-[#2B1D18] numeric">
              {formatRupiah(ewalletTotal)}
            </div>
            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${getPercent(ewalletTotal)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
