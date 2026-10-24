import React, { useState } from 'react';
import { Users, Search, UserPlus, Gift, Award, Calendar, Coffee, Plus } from 'lucide-react';
import { Member } from '../types/pos';

interface MemberManagementViewProps {
  members: Member[];
  onRegisterMember: (name: string, phone: string) => Member;
  onSelectForOrder?: (member: Member) => void;
}

export const MemberManagementView: React.FC<MemberManagementViewProps> = ({
  members,
  onRegisterMember,
  onSelectForOrder,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      setErrorMsg('Nama dan nomor HP wajib diisi');
      return;
    }
    const clean = phoneInput.replace(/[^0-9]/g, '');
    if (clean.length < 9) {
      setErrorMsg('Nomor HP minimal 9 digit angka');
      return;
    }

    onRegisterMember(nameInput.trim(), clean);
    setShowAddModal(false);
    setNameInput('');
    setPhoneInput('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E7DED6]">
        <div>
          <h2 className="text-base font-bold text-[#2B1D18] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B86F4B]" />
            Program Loyalitas & Member Coffee
          </h2>
          <p className="text-xs text-[#74665D]">
            Setiap pembelian 10 cup berbayar otomatis menghasilkan 1 Voucher Gratis 1 Cup untuk pelanggan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Daftarkan Member Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#74665D] absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari member via nama atau nomor HP..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E7DED6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B86F4B] text-[#2B1D18]"
        />
      </div>

      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const availableVouchers = member.vouchers.filter((v) => v.status === 'available');

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-[#E7DED6] p-4 flex flex-col justify-between shadow-2xs hover:border-[#B86F4B] transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#FAF7F3]">
                  <div>
                    <h3 className="font-bold text-sm text-[#2B1D18]">{member.name}</h3>
                    <div className="text-xs text-[#74665D] numeric mt-0.5">{member.phone}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#74665D] block">Total Pembelian</span>
                    <span className="text-xs font-bold text-[#2B1D18] numeric">
                      {member.totalLifetimeCups} Cup
                    </span>
                  </div>
                </div>

                {/* 10-cup Loyalty Stamp Progress Card */}
                <div className="my-3 p-3 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2B1D18] flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-[#B86F4B]" />
                      Kartu Stamp Loyalitas
                    </span>
                    <span className="font-bold text-[#B86F4B] numeric">
                      {member.cupProgress} / 10 Cup
                    </span>
                  </div>

                  {/* Stamp Dots */}
                  <div className="grid grid-cols-10 gap-1 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isStamped = i < member.cupProgress;
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                            isStamped
                              ? 'bg-[#B86F4B] text-white'
                              : 'bg-white border border-[#E7DED6] text-[#74665D]/40'
                          }`}
                          title={`Cup ${i + 1}`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-[#74665D] text-right">
                    {10 - member.cupProgress === 0
                      ? 'Milestone tercapai! Voucher akan terbit pada pembelian berikutnya.'
                      : `${10 - member.cupProgress} cup lagi untuk voucher gratis`}
                  </p>
                </div>

                {/* Vouchers section */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#74665D] flex items-center gap-1">
                    <Gift className="w-3 h-3 text-[#21865B]" />
                    Voucher Aktif ({availableVouchers.length})
                  </div>

                  {availableVouchers.length > 0 ? (
                    <div className="space-y-1">
                      {availableVouchers.map((v) => (
                        <div
                          key={v.id}
                          className="p-2 rounded-lg bg-[#E7F5ED] border border-[#21865B]/30 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#21865B]">{v.title}</div>
                            <div className="text-[10px] text-[#74665D]">Kode: {v.code}</div>
                          </div>
                          <span className="text-[10px] font-semibold text-[#21865B] bg-white px-2 py-0.5 rounded">
                            Tersedia
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#74665D] italic">
                      Belum ada voucher aktif saat ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {onSelectForOrder && (
                <div className="pt-3 mt-3 border-t border-[#FAF7F3]">
                  <button
                    onClick={() => onSelectForOrder(member)}
                    className="w-full py-1.5 bg-[#FAF7F3] hover:bg-[#B86F4B] hover:text-white text-[#2B1D18] text-xs font-semibold rounded-lg border border-[#E7DED6] hover:border-[#B86F4B] transition-colors"
                  >
                    Gunakan untuk Pesanan Saat Ini
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-xl w-full max-w-md p-5 flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#2B1D18] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#B86F4B]" />
              Daftarkan Member Baru
            </h3>

            {errorMsg && (
              <div className="p-2.5 rounded bg-[#FCEAE8] border border-[#B42318]/30 text-xs text-[#B42318]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Nomor HP (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#74665D] hover:bg-[#FAF7F3] rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-lg"
                >
                  Simpan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
