import React, { useState } from 'react';
import { Settings, Users, Shield, Store, Check, Save } from 'lucide-react';
import { AppUser, StoreSettings } from '../types/pos';
import { INITIAL_USERS } from '../data/mockData';

interface StoreSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [taxPercent, setTaxPercent] = useState(settings.taxPercent.toString());
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      storeName,
      tagline,
      address,
      phone,
      taxPercent: parseInt(taxPercent, 10) || 10,
      receiptFooter,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
          Store & Security Configuration
        </div>
        <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2 mt-0.5">
          <Settings className="w-5 h-5 text-[#B86F4B]" />
          Pengaturan Toko & Manajemen Akun
        </h2>
        <p className="text-xs text-[#74665D] mt-0.5">
          Konfigurasi identitas kedai kopi, pajak PB1, format struk cetak, dan matriks hak akses role pengguna.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#E7F5ED] border border-[#21865B]/30 text-xs text-[#21865B] font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Pengaturan toko berhasil diperbarui dan diterapkan ke seluruh modul POS!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Toko & Struk (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-[#2B1D18] pb-3 border-b border-[#FAF7F3] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#B86F4B]" />
            Informasi Toko & Parameter Struk
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#2B1D18] block mb-1">Nama Kedai Kopi</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs font-bold text-[#2B1D18]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B1D18] block mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs text-[#2B1D18]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#2B1D18] block mb-1">Alamat Outlet</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs text-[#2B1D18]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#2B1D18] block mb-1">Nomor Telepon Toko</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs text-[#2B1D18]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B1D18] block mb-1">Pajak Restoran PB1 (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs text-[#2B1D18] numeric"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#2B1D18] block mb-1">
                Catatan Footer Struk Cetak
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F3] border border-[#E7DED6] rounded-xl text-xs text-[#2B1D18]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>

        {/* User Roles & Matrix Table (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7DED6] p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#2B1D18] pb-3 border-b border-[#FAF7F3] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B86F4B]" />
            Daftar Pengguna & Hak Akses Role
          </h3>

          <div className="space-y-2.5">
            {INITIAL_USERS.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#2B1D18]">{user.name}</h4>
                  <div className="text-[11px] text-[#74665D]">{user.email}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#B86F4B] text-white font-bold text-[10px] uppercase">
                  {user.role}
                </span>
              </div>
            ))}
          </div>

          {/* Role Access Matrix Explanation */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-2 text-xs">
            <span className="font-bold text-[#2B1D18] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#B86F4B]" />
              Matriks Hak Akses (RBAC):
            </span>
            <ul className="text-[11px] text-[#74665D] space-y-1 pl-4 list-disc">
              <li><strong>Owner / Admin:</strong> Akses penuh seluruh dashboard, laporan, HPP, & inventori.</li>
              <li><strong>Kasir:</strong> POS transaksi, pembayaran, struk, member, & buka/tutup shift.</li>
              <li><strong>Barista:</strong> Layar khusus Antrean Barista KDS untuk peracikan pesanan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
