import React, { useState } from 'react';
import { X, GitBranch, Database, ExternalLink, CheckCircle2, Layers } from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'userflow' | 'erd' | 'mapping'>('userflow');

  if (!isOpen) return null;

  const erdEntities = [
    {
      name: 'users',
      desc: 'Akun staf kasir, barista, admin, dan owner kedai.',
      fields: ['id (PK)', 'name', 'email', 'role: owner|admin|cashier|barista', 'active'],
    },
    {
      name: 'cash_sessions',
      desc: 'Sesi buka/tutup laci kasir per shift dengan modal awal & audit selisih.',
      fields: ['id (PK)', 'user_id (FK)', 'starting_cash', 'expected_cash', 'actual_cash', 'difference', 'status: open|closed'],
    },
    {
      name: 'tables',
      desc: 'Daftar meja dine-in, nomor meja, kapasitas, dan status terisi/kosong.',
      fields: ['id (PK)', 'number', 'capacity', 'status: available|occupied|reserved', 'current_order_id (FK)'],
    },
    {
      name: 'menus & menu_categories',
      desc: 'Katalog minuman kopi, non-coffee, pastry, harga dasar, dan HPP.',
      fields: ['id (PK)', 'category_id (FK)', 'name', 'base_price', 'cost_price', 'is_cup_beverage', 'is_available'],
    },
    {
      name: 'ingredients & menu_recipes',
      desc: 'Bahan baku (biji kopi, susu, cup) dan komposisi resep per menu.',
      fields: ['id (PK)', 'name', 'current_stock', 'min_threshold', 'cost_per_unit', 'unit: g|ml|pcs'],
    },
    {
      name: 'members & vouchers',
      desc: 'Pelanggan terdaftar, counter stamp 10 cup, dan voucher reward gratis 1 cup.',
      fields: ['id (PK)', 'name', 'phone', 'cup_progress (0..9)', 'total_lifetime_cups', 'vouchers (FK)'],
    },
    {
      name: 'orders & order_items',
      desc: 'Transaksi pemesanan, kustomisasi varian (suhu, susu, gula), dan total pembayaran.',
      fields: ['id (PK)', 'order_number', 'service_type', 'table_id', 'total', 'tax', 'voucher_discount', 'barista_status'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B86F4B] flex items-center justify-center text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B1D18]">
                Arsitektur Sistem POS Coffee Shop & ERD
              </h3>
              <p className="text-xs text-[#74665D]">
                Visualisasi terpadu userflow operasional dan skema data relasional PostgreSQL/Prisma.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-[#74665D] hover:text-[#2B1D18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-[#E7DED6] bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('userflow')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'userflow'
                ? 'border-[#B86F4B] text-[#B86F4B]'
                : 'border-transparent text-[#74665D] hover:text-[#2B1D18]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Alur Userflow Kasir & Barista</span>
          </button>

          <button
            onClick={() => setActiveTab('erd')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'erd'
                ? 'border-[#B86F4B] text-[#B86F4B]'
                : 'border-transparent text-[#74665D] hover:text-[#2B1D18]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema Entitas Database (ERD)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#FAF7F3]">
          {activeTab === 'userflow' ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E7DED6] flex justify-between items-center">
                <span className="text-xs font-semibold text-[#74665D]">
                  Berkas sumber: /public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg
                </span>
                <a
                  href="/public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#B86F4B] hover:underline inline-flex items-center gap-1"
                >
                  Buka Penuh di Tab Baru
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="w-full overflow-auto max-h-[500px] border border-[#E7DED6] rounded-xl p-3 bg-white flex justify-center">
                <img
                  src="/public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg"
                  alt="POS Coffee Shop User Flow"
                  className="max-w-full h-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E7DED6] text-xs text-[#74665D]">
                Struktur database relasional didesain modular menggunakan PostgreSQL + Prisma ORM sesuai dengan referensi file ERD dan rekomendasi daftar halaman.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {erdEntities.map((ent, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#E7DED6] p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#B86F4B]" />
                      <h4 className="font-bold text-sm text-[#2B1D18]">{ent.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#74665D] leading-relaxed">{ent.desc}</p>
                    <div className="pt-2 border-t border-[#FAF7F3] space-y-1">
                      {ent.fields.map((f, i) => (
                        <div key={i} className="text-[11px] font-mono text-[#74665D] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B86F4B]/60" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7DED6] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#2B1D18] hover:bg-[#4A3027] rounded-xl shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
