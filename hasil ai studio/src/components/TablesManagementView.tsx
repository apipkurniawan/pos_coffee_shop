import React, { useState } from 'react';
import { UtensilsCrossed, Users, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { TableItem } from '../types/pos';

interface TablesManagementViewProps {
  tables: TableItem[];
  onSelectTableForPOS: (tableNumber: string) => void;
  onUpdateTableStatus: (tableId: string, status: 'available' | 'occupied' | 'reserved') => void;
}

export const TablesManagementView: React.FC<TablesManagementViewProps> = ({
  tables,
  onSelectTableForPOS,
  onUpdateTableStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');

  const filtered = tables.filter((t) => (filter === 'all' ? true : t.status === filter));

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Floor & Table Management
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#B86F4B]" />
            Manajemen Meja Dine-in
          </h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Pantau ketersediaan meja, kapasitas kursi, dan status pesanan aktif tamu di kedai.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F3] p-1 rounded-xl border border-[#E7DED6] text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-[#2B1D18] text-white shadow-xs' : 'text-[#74665D] hover:text-[#2B1D18]'
            }`}
          >
            Semua ({tables.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'available'
                ? 'bg-[#21865B] text-white shadow-xs'
                : 'text-[#74665D] hover:text-[#21865B]'
            }`}
          >
            Kosong ({availableCount})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'occupied'
                ? 'bg-[#B86F4B] text-white shadow-xs'
                : 'text-[#74665D] hover:text-[#B86F4B]'
            }`}
          >
            Terisi ({occupiedCount})
          </button>
          <button
            onClick={() => setFilter('reserved')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'reserved'
                ? 'bg-[#8A5200] text-white shadow-xs'
                : 'text-[#74665D] hover:text-[#8A5200]'
            }`}
          >
            Reserved ({reservedCount})
          </button>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((table) => {
          return (
            <div
              key={table.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm ${
                table.status === 'occupied'
                  ? 'border-[#B86F4B]/50'
                  : table.status === 'reserved'
                  ? 'border-amber-300'
                  : 'border-[#E7DED6]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#FAF7F3]">
                  <div>
                    <h3 className="font-bold text-base text-[#2B1D18]">{table.number}</h3>
                    <div className="text-xs text-[#74665D] flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Kapasitas {table.capacity} Orang</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      table.status === 'available'
                        ? 'bg-[#E7F5ED] text-[#21865B]'
                        : table.status === 'occupied'
                        ? 'bg-[#F2E3D9] text-[#B86F4B]'
                        : 'bg-[#FFF3D9] text-[#8A5200]'
                    }`}
                  >
                    {table.status === 'available'
                      ? 'Kosong'
                      : table.status === 'occupied'
                      ? 'Terisi'
                      : 'Reserved'}
                  </span>
                </div>

                {/* Status details */}
                <div className="py-3 text-xs text-[#74665D]">
                  {table.status === 'occupied' && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] space-y-1">
                      <div className="text-[11px] font-semibold text-[#2B1D18]">
                        Pesanan Aktif: {table.activeOrderNumber || 'Sedang Bersantap'}
                      </div>
                      <div className="text-[10px] text-[#74665D]">
                        Tamu sedang berada di meja.
                      </div>
                    </div>
                  )}

                  {table.status === 'reserved' && (
                    <div className="p-2.5 rounded-xl bg-[#FFF3D9] border border-[#8A5200]/20 text-[#8A5200] text-[11px]">
                      Meja di-reservasi untuk tamu pukul 12:30 WIB.
                    </div>
                  )}

                  {table.status === 'available' && (
                    <div className="p-2.5 rounded-xl bg-[#E7F5ED] border border-[#21865B]/20 text-[#21865B] text-[11px] flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Meja bersih & siap melayani pesanan baru.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#FAF7F3] flex items-center gap-2">
                {table.status === 'available' ? (
                  <button
                    onClick={() => onSelectTableForPOS(table.number)}
                    className="w-full py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <span>Pilih di POS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : table.status === 'occupied' ? (
                  <button
                    onClick={() => onUpdateTableStatus(table.id, 'available')}
                    className="w-full py-2 bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] text-xs font-semibold rounded-xl border border-[#E7DED6] transition-colors"
                  >
                    Tandai Meja Kosong
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateTableStatus(table.id, 'occupied')}
                    className="w-full py-2 bg-[#2B1D18] text-white text-xs font-semibold rounded-xl hover:bg-[#4A3027] transition-colors"
                  >
                    Tamu Duduk (Check-in)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
