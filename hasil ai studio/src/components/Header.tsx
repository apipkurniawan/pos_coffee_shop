import React from 'react';
import {
  Coffee,
  Layers,
  GitBranch,
  Plus,
  Menu as MenuIcon,
  DollarSign,
  UtensilsCrossed,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { AppUser } from '../types/pos';
import { MainNavRoute } from './NavigationSidebar';

export type ActiveTab = MainNavRoute;

interface HeaderProps {
  currentRoute: MainNavRoute;
  onNavigate: (route: MainNavRoute) => void;
  activeOrderCount: number;
  isCashSessionOpen: boolean;
  currentUser: AppUser;
  onToggleMobileSidebar: () => void;
  onNewTransaction: () => void;
  onOpenFlowModal: () => void;
}

const ROUTE_LABELS: Record<MainNavRoute, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Ringkas', subtitle: 'Metrik Penjualan & Performa Kedai' },
  pos: { title: 'POS / Kasir Utama', subtitle: 'Kasir, Pemesanan & Pembayaran Cepat' },
  kds: { title: 'Antrean Barista (KDS)', subtitle: 'Penyajian & Racikan Kopi' },
  cash_session: { title: 'Sesi Kasir (Shift)', subtitle: 'Modal Awal, Laci Uang & Rekonsiliasi' },
  tables: { title: 'Manajemen Meja Dine-in', subtitle: 'Kapasitas & Status Meja Tamu' },
  menus: { title: 'Daftar Menu & HPP', subtitle: 'Katalog, Biaya Resep & Margin' },
  members: { title: 'Member & 10-Cup Loyalty', subtitle: 'Stempel Kartu & Voucher Hadiah' },
  vouchers: { title: 'Manajemen Voucher', subtitle: 'Voucher Reward & Kupon Promosi' },
  inventory: { title: 'Stok Bahan & Resep', subtitle: 'Inventori Otomatis Terhubung Resep' },
  history: { title: 'Riwayat Transaksi', subtitle: 'Daftar Order & Cetak Ulang Struk' },
  reports: { title: 'Laporan Penjualan', subtitle: 'Omset Bersih, Pajak PB1 & Metode Bayar' },
  settings: { title: 'Pengaturan Kedai', subtitle: 'Data Toko, Struk & Hak Akses Role' },
  diagram: { title: 'Diagram Alur & ERD', subtitle: 'User Flowchart & Skema Relasional' },
};

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  activeOrderCount,
  isCashSessionOpen,
  currentUser,
  onToggleMobileSidebar,
  onNewTransaction,
  onOpenFlowModal,
}) => {
  const routeInfo = ROUTE_LABELS[currentRoute] || {
    title: 'Karsa POS',
    subtitle: 'Coffee Shop System',
  };

  return (
    <header className="sticky top-0 z-30 bg-[#2B1D18] text-[#FAF7F3] border-b border-[#4A3027] shadow-sm">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-[#FAF7F3] hover:bg-[#4A3027] rounded-xl transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            <MenuIcon className="w-5 h-5 text-[#B86F4B]" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                {routeInfo.title}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4A3027] text-[#FAF7F3] border border-[#684536]">
                <ShieldCheck className="w-3 h-3 text-[#B86F4B]" />
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
            <span className="text-[11px] text-[#F2E3D9]/60 hidden xs:block truncate">
              {routeInfo.subtitle}
            </span>
          </div>
        </div>

        {/* Center / Right: Quick Badges & Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shift status badge */}
          <button
            onClick={() => onNavigate('cash_session')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isCashSessionOpen
                ? 'bg-[#21865B]/15 text-[#46EDC8] border-[#21865B]/30 hover:bg-[#21865B]/25'
                : 'bg-[#B42318]/15 text-[#FFCDD2] border-[#B42318]/30 hover:bg-[#B42318]/25'
            }`}
            title="Klik untuk membuka status laci kasir"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCashSessionOpen ? 'bg-[#21865B]' : 'bg-[#B42318]'
              }`}
            />
            <span>Shift: {isCashSessionOpen ? 'Buka' : 'Tutup'}</span>
          </button>

          {/* KDS quick pill */}
          <button
            onClick={() => onNavigate('kds')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              currentRoute === 'kds'
                ? 'bg-[#B86F4B] text-white border-[#B86F4B]'
                : 'bg-[#4A3027]/70 text-[#F2E3D9] border-[#684536] hover:bg-[#4A3027]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B86F4B]" />
            <span>KDS</span>
            {activeOrderCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#B86F4B] text-white text-[10px] font-bold rounded-full numeric">
                {activeOrderCount}
              </span>
            )}
          </button>

          {/* Diagram Flowchart button */}
          <button
            onClick={onOpenFlowModal}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#F2E3D9] bg-[#4A3027]/80 hover:bg-[#4A3027] rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 border border-[#684536]"
            title="Lihat Alur User Flowchart & ERD"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#B86F4B]" />
            <span className="hidden sm:inline">Diagram Alur</span>
          </button>

          {/* Transaksi Baru Button */}
          <button
            onClick={onNewTransaction}
            className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Order Baru</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Bar */}
      <div className="lg:hidden flex items-center gap-1 px-2 py-1.5 overflow-x-auto text-xs bg-[#241814] border-t border-[#4A3027] no-scrollbar">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap flex items-center gap-1 ${
            currentRoute === 'dashboard' ? 'bg-[#B86F4B] text-white font-bold' : 'text-[#F2E3D9]/70'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('pos')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap flex items-center gap-1 ${
            currentRoute === 'pos' ? 'bg-[#B86F4B] text-white font-bold' : 'text-[#F2E3D9]/70'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Kasir POS
        </button>
        <button
          onClick={() => onNavigate('kds')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap flex items-center gap-1 ${
            currentRoute === 'kds' ? 'bg-[#B86F4B] text-white font-bold' : 'text-[#F2E3D9]/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          KDS {activeOrderCount > 0 && `(${activeOrderCount})`}
        </button>
        <button
          onClick={() => onNavigate('tables')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap flex items-center gap-1 ${
            currentRoute === 'tables' ? 'bg-[#B86F4B] text-white font-bold' : 'text-[#F2E3D9]/70'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          Meja
        </button>
        <button
          onClick={() => onNavigate('cash_session')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap flex items-center gap-1 ${
            currentRoute === 'cash_session' ? 'bg-[#B86F4B] text-white font-bold' : 'text-[#F2E3D9]/70'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Shift Kasir
        </button>
      </div>
    </header>
  );
};
