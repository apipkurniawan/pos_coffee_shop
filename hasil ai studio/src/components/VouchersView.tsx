import React, { useState } from 'react';
import { Ticket, Plus, Search, CheckCircle, Clock, X, Gift } from 'lucide-react';
import { Voucher } from '../types/pos';
import { formatRupiah } from '../utils/posLogic';

interface VouchersViewProps {
  vouchers: Voucher[];
  onCreateVoucher: (newVoucher: Voucher) => void;
}

export const VouchersView: React.FC<VouchersViewProps> = ({ vouchers, onCreateVoucher }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'used'>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'free_cup' | 'nominal' | 'percent'>('free_cup');
  const [discountValue, setDiscountValue] = useState('10000');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const filtered = vouchers.filter((v) => (filter === 'all' ? true : v.status === filter));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const newVch: Voucher = {
      id: `vch-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || 'Voucher promosi Karsa Coffee.',
      discountType,
      discountValue: discountType !== 'free_cup' ? parseInt(discountValue, 10) : undefined,
      status: 'available',
      expiryDate,
    };

    onCreateVoucher(newVch);
    setIsModalOpen(false);
    setTitle('');
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Promotion & Loyalty Rewards
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#B86F4B]" />
            Manajemen Voucher & Promo Toko
          </h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Kelola voucher gratis 1 cup hasil stamp loyalitas serta voucher diskon promosi berkala.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Voucher Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'all'
              ? 'bg-[#2B1D18] text-white border-[#2B1D18]'
              : 'bg-white text-[#74665D] border-[#E7DED6]'
          }`}
        >
          Semua ({vouchers.length})
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'available'
              ? 'bg-[#21865B] text-white border-[#21865B]'
              : 'bg-white text-[#74665D] border-[#E7DED6]'
          }`}
        >
          Tersedia ({vouchers.filter((v) => v.status === 'available').length})
        </button>
        <button
          onClick={() => setFilter('used')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'used'
              ? 'bg-[#74665D] text-white border-[#74665D]'
              : 'bg-white text-[#74665D] border-[#E7DED6]'
          }`}
        >
          Terpakai ({vouchers.filter((v) => v.status === 'used').length})
        </button>
      </div>

      {/* Voucher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-[#E7DED6] p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#FAF7F3]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B86F4B] tracking-wider">
                    {v.discountType === 'free_cup'
                      ? 'Reward 1 Cup Gratis'
                      : v.discountType === 'percent'
                      ? `Diskon ${v.discountValue}%`
                      : `Potongan ${formatRupiah(v.discountValue || 0)}`}
                  </span>
                  <h3 className="font-bold text-sm text-[#2B1D18]">{v.title}</h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    v.status === 'available'
                      ? 'bg-[#E7F5ED] text-[#21865B]'
                      : 'bg-[#FAF7F3] text-[#74665D] border border-[#E7DED6]'
                  }`}
                >
                  {v.status === 'available' ? 'Aktif' : 'Terpakai'}
                </span>
              </div>

              <p className="text-xs text-[#74665D] my-2 leading-relaxed">{v.description}</p>
            </div>

            <div className="pt-3 border-t border-[#FAF7F3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#74665D] block">Kode Promo:</span>
                <span className="font-mono font-bold text-[#2B1D18]">{v.code}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#74665D] block">Berlaku Sampai:</span>
                <span className="font-semibold text-[#74665D] numeric">{v.expiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Voucher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7DED6]">
              <h3 className="font-bold text-base text-[#2B1D18] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B86F4B]" />
                Buat Voucher / Promo Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#74665D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Judul Voucher
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Diskon Akhir Pekan 20%"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                    Kode Unik
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: WEEKEND20"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                    Tipe Diskon
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                  >
                    <option value="free_cup">Gratis 1 Cup Bebas</option>
                    <option value="nominal">Potongan Nominal (Rp)</option>
                    <option value="percent">Persentase Diskon (%)</option>
                  </select>
                </div>
              </div>

              {discountType !== 'free_cup' && (
                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                    Nilai Diskon ({discountType === 'percent' ? '%' : 'Rp'})
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl numeric"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Masa Berlaku Hingga
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Syarat dan ketentuan penukaran..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#74665D] hover:bg-[#FAF7F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-xl shadow-xs"
                >
                  Terbitkan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
