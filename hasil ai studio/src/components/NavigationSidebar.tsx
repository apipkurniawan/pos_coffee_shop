import React from 'react';
import {
  Coffee,
  Layers,
  Users,
  Package,
  History,
  LayoutDashboard,
  UtensilsCrossed,
  DollarSign,
  Ticket,
  BarChart3,
  Settings,
  GitBranch,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { AppUser, UserRole } from '../types/pos';
import { INITIAL_USERS } from '../data/mockData';

export type MainNavRoute =
  | 'dashboard'
  | 'pos'
  | 'kds'
  | 'cash_session'
  | 'tables'
  | 'menus'
  | 'members'
  | 'vouchers'
  | 'inventory'
  | 'reports'
  | 'settings'
  | 'diagram'
  | 'history';

interface NavigationSidebarProps {
  currentRoute: MainNavRoute;
  onNavigate: (route: MainNavRoute) => void;
  currentUser: AppUser;
  onChangeUser: (user: AppUser) => void;
  activeOrderCount: number;
  isCashSessionOpen: boolean;
  onNewOrder: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentRoute,
  onNavigate,
  currentUser,
  onChangeUser,
  activeOrderCount,
  isCashSessionOpen,
  onNewOrder,
}) => {
  return (
    <aside className="w-64 bg-[#2B1D18] text-[#FAF7F3] border-r border-[#4A3027] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#4A3027] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#B86F4B] flex items-center justify-center text-white shadow-sm shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white leading-tight">
              KARSA COFFEE
            </h1>
            <p className="text-[11px] text-[#F2E3D9]/60">POS & Management</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="p-3 bg-[#4A3027]/40 border-b border-[#4A3027]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[11px] uppercase font-bold text-[#F2E3D9]/70 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B86F4B]" />
            Role Pengguna:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#B86F4B] text-white text-[10px] font-bold uppercase tracking-wider">
            {currentUser.role}
          </span>
        </div>

        <select
          value={currentUser.id}
          onChange={(e) => {
            const found = INITIAL_USERS.find((u) => u.id === e.target.value);
            if (found) onChangeUser(found);
          }}
          className="w-full bg-[#2B1D18] border border-[#684536] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
        >
          {INITIAL_USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — ({u.role.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Quick POS Trigger Action */}
      <div className="p-3 border-b border-[#4A3027]">
        <button
          onClick={onNewOrder}
          className="w-full py-2.5 px-3 bg-[#B86F4B] hover:bg-[#a35e3c] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Transaksi Baru</span>
        </button>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-medium">
        {/* Ringkasan */}
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'dashboard'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#B86F4B]" />
            <span>Dashboard Ringkas</span>
          </button>
        </div>

        {/* Section: Penjualan */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-[#F2E3D9]/50 uppercase tracking-wider">
            Penjualan & Kasir
          </div>

          <button
            onClick={() => onNavigate('pos')}
            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
              currentRoute === 'pos'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-[#B86F4B]" />
              <span>POS / Kasir Utama</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'history'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <History className="w-4 h-4 text-[#B86F4B]" />
            <span>Riwayat Transaksi</span>
          </button>

          <button
            onClick={() => onNavigate('cash_session')}
            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
              currentRoute === 'cash_session'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-[#B86F4B]" />
              <span>Sesi Kasir (Shift)</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isCashSessionOpen ? 'bg-[#21865B]/30 text-[#46EDC8]' : 'bg-[#B42318]/30 text-[#FFCDD2]'
              }`}
            >
              {isCashSessionOpen ? 'Buka' : 'Tutup'}
            </span>
          </button>
        </div>

        {/* Section: Operasional */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-[#F2E3D9]/50 uppercase tracking-wider">
            Operasional Kedai
          </div>

          <button
            onClick={() => onNavigate('kds')}
            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
              currentRoute === 'kds'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#B86F4B]" />
              <span>Antrean Barista (KDS)</span>
            </div>
            {activeOrderCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#B86F4B] text-white text-[10px] font-bold rounded-full numeric">
                {activeOrderCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('tables')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'tables'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-[#B86F4B]" />
            <span>Manajemen Meja</span>
          </button>
        </div>

        {/* Section: Menu & Inventori */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-[#F2E3D9]/50 uppercase tracking-wider">
            Katalog & Inventori
          </div>

          <button
            onClick={() => onNavigate('menus')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'menus'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <Coffee className="w-4 h-4 text-[#B86F4B]" />
            <span>Daftar Menu & HPP</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'inventory'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <Package className="w-4 h-4 text-[#B86F4B]" />
            <span>Stok Bahan & Resep</span>
          </button>
        </div>

        {/* Section: Pelanggan */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-[#F2E3D9]/50 uppercase tracking-wider">
            Pelanggan & Promo
          </div>

          <button
            onClick={() => onNavigate('members')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'members'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <Users className="w-4 h-4 text-[#B86F4B]" />
            <span>Member & 10-Cup Loyalty</span>
          </button>

          <button
            onClick={() => onNavigate('vouchers')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'vouchers'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#B86F4B]" />
            <span>Manajemen Voucher</span>
          </button>
        </div>

        {/* Section: Laporan & Sistem */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-[#F2E3D9]/50 uppercase tracking-wider">
            Laporan & Pengaturan
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'reports'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#B86F4B]" />
            <span>Laporan Penjualan</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'settings'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <Settings className="w-4 h-4 text-[#B86F4B]" />
            <span>Pengaturan Toko & Role</span>
          </button>

          <button
            onClick={() => onNavigate('diagram')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
              currentRoute === 'diagram'
                ? 'bg-[#4A3027] text-white font-bold shadow-xs'
                : 'text-[#F2E3D9]/75 hover:text-white hover:bg-[#4A3027]/40'
            }`}
          >
            <GitBranch className="w-4 h-4 text-[#B86F4B]" />
            <span>Diagram Alur & ERD</span>
          </button>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#4A3027] text-[11px] text-[#F2E3D9]/50 text-center">
        Karsa POS v1.0 · Jakarta
      </div>
    </aside>
  );
};
