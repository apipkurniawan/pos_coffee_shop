import React, { useState } from 'react';
import { User, UserPlus, Search, UtensilsCrossed, ShoppingBag, Gift, Check, X } from 'lucide-react';
import { Member, ServiceType, Voucher } from '../types/pos';

interface CustomerServiceSelectorProps {
  members: Member[];
  selectedMember: Member | null;
  onSelectMember: (member: Member | null) => void;
  onRegisterMember: (name: string, phone: string) => Member;
  serviceType: ServiceType;
  onChangeServiceType: (type: ServiceType) => void;
  tableNumber: string;
  onChangeTableNumber: (table: string) => void;
  takeawayName: string;
  onChangeTakeawayName: (name: string) => void;
  voucherApplied: boolean;
  onToggleVoucher: (apply: boolean, voucher?: Voucher) => void;
}

export const CustomerServiceSelector: React.FC<CustomerServiceSelectorProps> = ({
  members,
  selectedMember,
  onSelectMember,
  onRegisterMember,
  serviceType,
  onChangeServiceType,
  tableNumber,
  onChangeTableNumber,
  takeawayName,
  onChangeTakeawayName,
  voucherApplied,
  onToggleVoucher,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Filtered members for phone search
  const filteredMembers = members.filter(
    (m) =>
      m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      setRegisterError('Nama dan nomor HP wajib diisi');
      return;
    }
    const cleanPhone = newPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setRegisterError('Nomor HP minimal 9 digit angka');
      return;
    }

    const created = onRegisterMember(newName.trim(), cleanPhone);
    setShowRegisterModal(false);
    setNewName('');
    setNewPhone('');
    setRegisterError('');
  };

  const availableVouchers = selectedMember?.vouchers.filter((v) => v.status === 'available') || [];

  return (
    <div className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Kolom 1: Member Status & Identification (5 cols) */}
        <div className="md:col-span-6 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-[#E7DED6] pb-3 md:pb-0 md:pr-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#74665D] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B86F4B]" />
              Identitas Pelanggan
            </span>
            {selectedMember ? (
              <button
                onClick={() => {
                  onSelectMember(null);
                  onToggleVoucher(false);
                }}
                className="text-xs text-[#B42318] hover:underline flex items-center gap-0.5"
                title="Ganti ke Pelanggan Reguler"
              >
                <X className="w-3 h-3" />
                Ganti Guest
              </button>
            ) : (
              <span className="text-xs text-[#74665D]">Pelanggan Reguler</span>
            )}
          </div>

          {selectedMember ? (
            <div className="bg-[#FAF7F3] rounded-lg p-3 border border-[#E7DED6] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#2B1D18] flex items-center gap-1.5">
                    {selectedMember.name}
                    <span className="text-[11px] font-normal text-[#74665D] numeric">
                      ({selectedMember.phone})
                    </span>
                  </h4>
                </div>

                {/* Stamp cup counter */}
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#2B1D18]">
                    Progres: <span className="text-[#B86F4B] numeric font-bold">{selectedMember.cupProgress}</span> / 10 Cup
                  </div>
                </div>
              </div>

              {/* 10-cup Visual Stamp Progress Dots */}
              <div className="flex items-center gap-1.5 pt-1">
                {Array.from({ length: 10 }).map((_, index) => {
                  const isFilled = index < selectedMember.cupProgress;
                  return (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        isFilled
                          ? 'bg-[#B86F4B]'
                          : 'bg-[#E7DED6]'
                      }`}
                      title={`Cup ${index + 1}`}
                    />
                  );
                })}
              </div>

              {/* Voucher status & quick apply */}
              {availableVouchers.length > 0 ? (
                <div className="mt-1 pt-2 border-t border-[#E7DED6]/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#21865B] font-medium">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Punya {availableVouchers.length} voucher gratis 1 cup!</span>
                  </div>
                  <button
                    onClick={() => onToggleVoucher(!voucherApplied, availableVouchers[0])}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                      voucherApplied
                        ? 'bg-[#21865B] text-white'
                        : 'bg-[#E7F5ED] text-[#21865B] hover:bg-[#21865B] hover:text-white border border-[#21865B]/30'
                    }`}
                  >
                    {voucherApplied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Voucher Terpasang
                      </>
                    ) : (
                      'Tukar Voucher'
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#74665D]">
                  {10 - selectedMember.cupProgress} cup lagi untuk mendapatkan Voucher Gratis 1 Cup.
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex-1 px-3 py-2 text-xs font-medium bg-[#FAF7F3] hover:bg-[#F2E3D9] text-[#2B1D18] rounded-lg border border-[#E7DED6] transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-[#B86F4B]" />
                Cari Member (No. HP)
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3 py-2 text-xs font-medium bg-[#4A3027] hover:bg-[#2B1D18] text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#F2E3D9]" />
                Daftar Baru
              </button>
            </div>
          )}
        </div>

        {/* Kolom 2: Service Type & Details (Dine-in vs Takeaway) (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#74665D] uppercase tracking-wider">
            Tipe Layanan & Lokasi
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeServiceType('dine_in')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                serviceType === 'dine_in'
                  ? 'bg-[#B86F4B] text-white border-[#B86F4B] shadow-xs'
                  : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Dine-in (Meja)</span>
            </button>

            <button
              onClick={() => onChangeServiceType('takeaway')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                serviceType === 'takeaway'
                  ? 'bg-[#B86F4B] text-white border-[#B86F4B] shadow-xs'
                  : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Takeaway (Bungkus)</span>
            </button>
          </div>

          {/* Conditional input based on service type */}
          {serviceType === 'dine_in' ? (
            <div className="flex items-center gap-2">
              <label htmlFor="table-number-input" className="text-xs font-medium text-[#74665D] shrink-0">
                Nomor Meja:
              </label>
              <input
                id="table-number-input"
                type="text"
                value={tableNumber}
                onChange={(e) => onChangeTableNumber(e.target.value)}
                placeholder="Contoh: Meja 04"
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-md focus:outline-none focus:ring-1 focus:ring-[#B86F4B] text-[#2B1D18]"
              />
              <div className="flex items-center gap-1">
                {['01', '04', '08', '12'].map((num) => (
                  <button
                    key={num}
                    onClick={() => onChangeTableNumber(`Meja ${num}`)}
                    className="px-2 py-1 text-[11px] bg-white border border-[#E7DED6] hover:border-[#B86F4B] rounded text-[#74665D]"
                  >
                    M{num}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="takeaway-name-input" className="text-xs font-medium text-[#74665D] shrink-0">
                Nama Pengambil:
              </label>
              <input
                id="takeaway-name-input"
                type="text"
                value={takeawayName}
                onChange={(e) => onChangeTakeawayName(e.target.value)}
                placeholder="Contoh: Kak Sarah / Bpk Budi"
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-md focus:outline-none focus:ring-1 focus:ring-[#B86F4B] text-[#2B1D18]"
              />
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Cari Member melalui Nomor HP */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7DED6] shadow-xl w-full max-w-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7DED6]">
              <h3 className="font-semibold text-base text-[#2B1D18] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#B86F4B]" />
                Cari Member Terdaftar
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-[#74665D] hover:text-[#2B1D18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#74665D] absolute left-3 top-2.5" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nomor HP (misal: 0812) atau nama..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B86F4B]"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member);
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }}
                    className="p-3 rounded-lg border border-[#E7DED6] hover:border-[#B86F4B] hover:bg-[#FAF7F3] cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#2B1D18]">{member.name}</div>
                      <div className="text-xs text-[#74665D] numeric">{member.phone}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#B86F4B]">
                        {member.cupProgress}/10 Stamp
                      </span>
                      {member.vouchers.filter((v) => v.status === 'available').length > 0 && (
                        <div className="text-[11px] text-[#21865B] font-medium">
                          {member.vouchers.filter((v) => v.status === 'available').length} Voucher
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-[#74665D]">
                  <p>Tidak ada member dengan kata kunci tersebut.</p>
                  <button
                    onClick={() => {
                      setShowSearchModal(false);
                      setShowRegisterModal(true);
                      setNewPhone(searchQuery);
                    }}
                    className="mt-2 text-xs text-[#B86F4B] font-medium hover:underline"
                  >
                    + Daftarkan sebagai Member Baru
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E7DED6] flex justify-between items-center text-xs text-[#74665D]">
              <span>Contoh demo: 081234567890 (Budi) / 085711223344 (Dimas)</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-3 py-1.5 rounded bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18]"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Input Nama dan Nomor HP Member Baru */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7DED6] shadow-xl w-full max-w-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7DED6]">
              <h3 className="font-semibold text-base text-[#2B1D18] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#B86F4B]" />
                Daftarkan Member Baru
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-[#74665D] hover:text-[#2B1D18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#74665D]">
              Member baru langsung terhubung ke transaksi saat ini dan otomatis mendapatkan program loyalitas 10 cup gratis 1 cup.
            </p>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              {registerError && (
                <div className="p-2.5 rounded bg-[#FCEAE8] border border-[#B42318]/30 text-xs text-[#B42318]">
                  {registerError}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2B1D18]">Nama Lengkap</label>
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="px-3 py-2 text-sm bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B86F4B]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2B1D18]">Nomor HP (WhatsApp)</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Contoh: 081298765432"
                  className="px-3 py-2 text-sm bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B86F4B]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#E7DED6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#74665D] hover:bg-[#FAF7F3] rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-lg shadow-sm"
                >
                  Simpan & Hubungkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
