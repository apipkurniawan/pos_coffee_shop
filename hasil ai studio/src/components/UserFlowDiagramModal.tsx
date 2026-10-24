import React, { useState } from 'react';
import { X, GitBranch, CheckCircle2, ChevronRight, Layers, Coffee, ExternalLink } from 'lucide-react';

interface UserFlowDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserFlowDiagramModal: React.FC<UserFlowDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeStepTab, setActiveStepTab] = useState<'diagram' | 'steps'>('steps');

  if (!isOpen) return null;

  const flowNodes = [
    {
      id: '1',
      title: 'Pelanggan & Kasir',
      desc: 'Pelanggan datang ke kasir. Sistem menanyakan apakah pelanggan adalah Member terdaftar.',
      appFeature: 'Bilah Identitas Pelanggan di bagian atas kasir (Cari via No. HP atau Daftar Member Baru).',
      badge: 'Step 1',
    },
    {
      id: '2',
      title: 'Pilih Layanan (Dine-in / Takeaway)',
      desc: 'Jika Dine-in: Catat nomor meja. Jika Takeaway: Catat nama pemesan/pengambil.',
      appFeature: 'Pilihan tombol Dine-in (Meja 01..16) & Takeaway (Nama Pengambil).',
      badge: 'Step 2',
    },
    {
      id: '3',
      title: 'Pemesanan Menu Kopi & Makanan',
      desc: 'Input menu, opsi suhu (Hot/Iced), ukuran (Reg/Large), manis, susu oat/almond, dan extra shot.',
      appFeature: 'Katalog Menu dengan Kustomisasi Peracikan & Keranjang Belanja.',
      badge: 'Step 3',
    },
    {
      id: '4',
      title: 'Validasi Voucher Gratis 1 Cup',
      desc: 'Member yang memiliki voucher aktif dapat menukarkannya langsung untuk 1 cup minuman gratis.',
      appFeature: 'Tombol "Tukar Voucher" otomatis memotong harga cup di keranjang belanja.',
      badge: 'Step 4',
    },
    {
      id: '5',
      title: 'Perhitungan & Pembayaran Kasir',
      desc: 'Sistem menghitung subtotal, diskon voucher, pajak PB1 (10%), dan menerima pembayaran tunai/QRIS/kartu.',
      appFeature: 'Modal Pembayaran Kasir dengan validasi kelunasan, uang pas, kembalian, & QRIS dinamis.',
      badge: 'Step 5',
    },
    {
      id: '6',
      title: 'Post-Payment: 4 Cabang Otomasi Sekaligus',
      desc: 'Setelah pembayaran lunas, sistem secara otomatis mengeksekusi 4 proses simultan:',
      branches: [
        'Cabang A: Cetak struk dan nomor pesanan (#ORD-XX)',
        'Cabang B: Simpan transaksi & kurangi stok bahan baku sesuai resep',
        'Cabang C: Tambahkan progres pembelian member (+1 stamp/cup), terbitkan voucher jika mencapai kelipatan 10 cup',
        'Cabang D: Antrean Barista (KDS) -> Diracik -> Pesanan Siap -> Sajikan ke Meja (Dine-in) atau Kemas (Takeaway)',
      ],
      appFeature: 'Modal Struk Digital, Tab Antrean Barista (KDS), Tab Stok Bahan, & Tab Member.',
      badge: 'Step 6',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B86F4B] flex items-center justify-center text-white">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B1D18]">
                Alur Diagram Sistem POS Coffee Shop
              </h3>
              <p className="text-xs text-[#74665D]">
                Implementasi terpadu berdasarkan berkas arsitektur userflow lampiran pengguna.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#74665D] hover:text-[#2B1D18] hover:bg-[#E7DED6]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Step Walkthrough & Full SVG Diagram */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-[#E7DED6] bg-white">
          <button
            onClick={() => setActiveStepTab('steps')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'steps'
                ? 'border-[#B86F4B] text-[#B86F4B]'
                : 'border-transparent text-[#74665D] hover:text-[#2B1D18]'
            }`}
          >
            <span>Ringkasan Interaktif Alur Sistem</span>
          </button>
          <button
            onClick={() => setActiveStepTab('diagram')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'diagram'
                ? 'border-[#B86F4B] text-[#B86F4B]'
                : 'border-transparent text-[#74665D] hover:text-[#2B1D18]'
            }`}
          >
            <span>Bagan Flowchart Asli (SVG)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#FAF7F3]">
          {activeStepTab === 'steps' ? (
            <div className="space-y-3">
              {flowNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-white border border-[#E7DED6] shadow-2xs space-y-2 hover:border-[#B86F4B] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#B86F4B] bg-[#F2E3D9] px-2 py-0.5 rounded-full">
                      {node.badge}
                    </span>
                    <h4 className="font-bold text-sm text-[#2B1D18] flex-1 ml-2.5">
                      {node.title}
                    </h4>
                  </div>

                  <p className="text-xs text-[#74665D] leading-relaxed">{node.desc}</p>

                  {node.branches && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {node.branches.map((b, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-[#FAF7F3] border border-[#E7DED6] text-xs font-medium text-[#2B1D18] flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#21865B] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#FAF7F3] flex items-center gap-2 text-[11px] text-[#74665D]">
                    <span className="font-semibold text-[#2B1D18]">Lokasi di Aplikasi:</span>
                    <span className="text-[#B86F4B] font-medium">{node.appFeature}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-[#E7DED6] flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-[#74665D]">
                  Berkas sumber: /public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg
                </span>
                <a
                  href="/public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#B86F4B] hover:underline inline-flex items-center gap-1"
                >
                  Buka Penuh di Tab Baru
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-full overflow-auto max-h-[500px] border border-[#E7DED6] rounded-lg p-2 bg-white flex justify-center">
                <img
                  src="/public/assets/aistudio/POS_coffee_shop_userflow_1339cddb.svg"
                  alt="POS Coffee Shop User Flow"
                  className="max-w-full h-auto object-contain"
                />
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
