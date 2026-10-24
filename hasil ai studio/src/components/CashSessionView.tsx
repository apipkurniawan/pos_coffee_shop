import React, { useState } from 'react';
import { DollarSign, Clock, CheckCircle2, AlertCircle, ShieldAlert, ArrowDownCircle, Printer } from 'lucide-react';
import { CashSession, Order } from '../types/pos';
import { calculateCashSessionSummary, formatRupiah } from '../utils/posLogic';

interface CashSessionViewProps {
  session: CashSession;
  orders: Order[];
  onCloseSession: (actualCash: number, notes: string) => void;
  onOpenNewSession: (cashierName: string, startingCash: number) => void;
}

export const CashSessionView: React.FC<CashSessionViewProps> = ({
  session,
  orders,
  onCloseSession,
  onOpenNewSession,
}) => {
  const summary = calculateCashSessionSummary(session.startingCash, orders);

  const [actualInput, setActualInput] = useState<string>(summary.expectedDrawerCash.toString());
  const [closingNotes, setClosingNotes] = useState<string>('');
  const [isClosingFormOpen, setIsClosingFormOpen] = useState(false);

  // New session modal
  const [newCashierName, setNewCashierName] = useState('Budi (Kasir)');
  const [newStartingCash, setNewStartingCash] = useState('250000');

  const numericActual = parseInt(actualInput.replace(/[^0-9]/g, ''), 10) || 0;
  const cashDifference = numericActual - summary.expectedDrawerCash;

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    onCloseSession(numericActual, closingNotes);
    setIsClosingFormOpen(false);
  };

  const handleConfirmOpen = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenNewSession(newCashierName, parseInt(newStartingCash, 10) || 0);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Cash Management
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#B86F4B]" />
            Sesi Kasir & Buka / Tutup Shift
          </h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Pengendalian modal awal, rekonsiliasi penerimaan kas, dan audit selisih laci uang kasir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session.status === 'open' ? (
            <button
              onClick={() => setIsClosingFormOpen(true)}
              className="px-4 py-2 bg-[#B42318] hover:bg-[#8e1b12] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Tutup Shift Kasir
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-[#FAF7F3] border border-[#E7DED6] text-xs font-bold text-[#74665D] rounded-xl">
              Shift Telah Ditutup
            </span>
          )}
        </div>
      </div>

      {session.status === 'open' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Shift Summary (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7DED6] p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F3]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#74665D]">Nomor Sesi</span>
                <div className="text-sm font-bold text-[#2B1D18] numeric">{session.id}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#74665D]">Status Shift</span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E7F5ED] text-[#21865B] font-bold text-xs inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aktif / Terbuka
                  </span>
                </div>
              </div>
            </div>

            {/* Shift Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-[#FAF7F3] rounded-xl border border-[#E7DED6]">
                <span className="text-[11px] text-[#74665D] font-medium">Kasir Bertugas</span>
                <div className="text-sm font-bold text-[#2B1D18] mt-0.5">{session.cashierName}</div>
              </div>
              <div className="p-3.5 bg-[#FAF7F3] rounded-xl border border-[#E7DED6]">
                <span className="text-[11px] text-[#74665D] font-medium">Waktu Buka Shift</span>
                <div className="text-sm font-bold text-[#2B1D18] numeric mt-0.5">
                  {session.openedAt} WIB
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF7F3] rounded-xl border border-[#E7DED6]">
                <span className="text-[11px] text-[#74665D] font-medium">Modal Awal Kas</span>
                <div className="text-sm font-bold text-[#2B1D18] numeric mt-0.5">
                  {formatRupiah(summary.startingCash)}
                </div>
              </div>
            </div>

            {/* Payment Revenue Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-[#2B1D18] uppercase tracking-wider">
                Rekap Penerimaan Pembayaran Shift Berjalan
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#FAF7F3] flex items-center justify-between text-xs">
                  <span className="text-[#74665D] font-medium">Penerimaan Tunai (Cash)</span>
                  <span className="font-bold text-[#2B1D18] numeric">
                    {formatRupiah(summary.totalCashSales)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F3] flex items-center justify-between text-xs">
                  <span className="text-[#74665D] font-medium">Penerimaan Non-Tunai (QRIS, EDC, E-Wallet)</span>
                  <span className="font-bold text-[#2B1D18] numeric">
                    {formatRupiah(summary.totalNonCashSales)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#2B1D18] text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#F2E3D9]/80 block font-medium">
                      Estimasi Kas Fisik yang Wajib Ada di Laci:
                    </span>
                    <span className="text-[11px] text-[#F2E3D9]/60">
                      (Modal Awal + Penjualan Tunai)
                    </span>
                  </div>
                  <span className="text-xl font-bold numeric text-[#F2E3D9]">
                    {formatRupiah(summary.expectedDrawerCash)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Form Side-Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#2B1D18] pb-2 border-b border-[#FAF7F3]">
              Prosedur Tutup Shift Kasir
            </h3>

            <p className="text-xs text-[#74665D] leading-relaxed">
              Hitung uang fisik di laci kasir secara teliti sebelum mengakhiri sesi kerja untuk menghindari selisih.
            </p>

            <form onSubmit={handleConfirmClose} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Uang Fisik Aktual di Laci (Rp)
                </label>
                <input
                  type="text"
                  value={actualInput}
                  onChange={(e) => setActualInput(e.target.value)}
                  className="w-full px-3 py-2 text-base font-bold bg-[#FAF7F3] border border-[#E7DED6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B86F4B] numeric"
                  required
                />
              </div>

              {/* Difference Gauge */}
              <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#74665D] font-medium">Selisih Kas:</span>
                  {cashDifference === 0 ? (
                    <span className="font-bold text-[#21865B] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pas (Rp0)
                    </span>
                  ) : cashDifference > 0 ? (
                    <span className="font-bold text-[#21865B] numeric">
                      + Lebih {formatRupiah(cashDifference)}
                    </span>
                  ) : (
                    <span className="font-bold text-[#B42318] numeric">
                      - Kurang {formatRupiah(Math.abs(cashDifference))}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Catatan Penutupan Shift (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Contoh: Kas fisik pas, laci siap diserahkan ke shift sore."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors"
              >
                Tutup Shift & Rekap Kas
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* If session is closed, provide Open New Session Form */
        <div className="bg-white rounded-2xl border border-[#E7DED6] p-8 max-w-lg mx-auto shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F3] border border-[#E7DED6] flex items-center justify-center mx-auto text-[#B86F4B]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#2B1D18]">Tidak Ada Sesi Kasir yang Aktif</h3>
            <p className="text-xs text-[#74665D] mt-1">
              Buka shift kasir baru dengan menginput modal awal uang tunai di laci kasir.
            </p>
          </div>

          <form onSubmit={handleConfirmOpen} className="space-y-3 text-left pt-2">
            <div>
              <label className="text-xs font-semibold text-[#2B1D18] block mb-1">Nama Kasir</label>
              <input
                type="text"
                value={newCashierName}
                onChange={(e) => setNewCashierName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                Modal Awal Laci (Rp)
              </label>
              <input
                type="number"
                value={newStartingCash}
                onChange={(e) => setNewStartingCash(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl numeric"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#B86F4B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#a35e3c]"
            >
              Mulai Sesi Kasir Baru
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
