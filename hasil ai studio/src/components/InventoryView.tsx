import React from 'react';
import { Package, AlertTriangle, CheckCircle, RefreshCw, Plus } from 'lucide-react';
import { InventoryItem } from '../types/pos';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onRestock: (itemId: string, addAmount: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onRestock }) => {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E7DED6]">
        <div>
          <h2 className="text-base font-bold text-[#2B1D18] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#B86F4B]" />
            Inventaris & Pemotongan Resep Otomatis
          </h2>
          <p className="text-xs text-[#74665D]">
            Stok bahan baku otomatis berkurang setiap kali kasir menyelesaikan transaksi pembayaran lunas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#FAF7F3] border border-[#E7DED6] rounded-lg text-[#74665D]">
            Total Bahan: <strong className="text-[#2B1D18] numeric">{inventory.length} item</strong>
          </span>
          <span className="px-2.5 py-1 bg-[#FFF3D9] border border-[#8A5200]/30 rounded-lg text-[#8A5200]">
            Perhatian:{' '}
            <strong className="numeric">
              {inventory.filter((i) => i.currentStock <= i.minThreshold).length}
            </strong>
          </span>
        </div>
      </div>

      {/* Inventory Table / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {inventory.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          const percentage = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 3)) * 100));

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition-all ${
                isLow ? 'border-[#B42318]/50 ring-1 ring-[#B42318]/20' : 'border-[#E7DED6]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#FAF7F3]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#74665D] tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-[#2B1D18] leading-snug">{item.name}</h3>
                  </div>
                  {isLow ? (
                    <span className="px-2 py-0.5 bg-[#FCEAE8] text-[#B42318] text-[10px] font-bold rounded-md flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                      Menipis
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#E7F5ED] text-[#21865B] text-[10px] font-semibold rounded-md flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3 h-3" />
                      Aman
                    </span>
                  )}
                </div>

                {/* Stock Gauge */}
                <div className="my-3 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-[#74665D]">Stok Saat Ini:</span>
                    <span className="text-base font-bold text-[#2B1D18] numeric">
                      {item.currentStock.toLocaleString('id-ID')} {item.unit}
                    </span>
                  </div>

                  <div className="w-full bg-[#FAF7F3] border border-[#E7DED6] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLow ? 'bg-[#B42318]' : 'bg-[#21865B]'
                      }`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#74665D] numeric">
                    <span>Batas Min: {item.minThreshold} {item.unit}</span>
                    <span>Status: {percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Restock Action */}
              <div className="pt-3 border-t border-[#FAF7F3] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#74665D]">Tambah Stok:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onRestock(item.id, item.unit === 'g' || item.unit === 'ml' ? 500 : 25)
                    }
                    className="px-2.5 py-1 text-xs bg-[#FAF7F3] hover:bg-[#B86F4B] hover:text-white border border-[#E7DED6] rounded-md text-[#2B1D18] font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    +{item.unit === 'g' || item.unit === 'ml' ? '500' : '25'}
                  </button>
                  <button
                    onClick={() =>
                      onRestock(item.id, item.unit === 'g' || item.unit === 'ml' ? 1000 : 50)
                    }
                    className="px-2.5 py-1 text-xs bg-[#FAF7F3] hover:bg-[#B86F4B] hover:text-white border border-[#E7DED6] rounded-md text-[#2B1D18] font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    +{item.unit === 'g' || item.unit === 'ml' ? '1000' : '50'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
