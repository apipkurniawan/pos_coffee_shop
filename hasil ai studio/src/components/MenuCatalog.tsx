import React, { useState } from 'react';
import { Search, Plus, Coffee, Sparkles, Filter } from 'lucide-react';
import { CategoryId, MenuItem, OrderItem } from '../types/pos';
import { CATEGORIES } from '../data/mockData';
import { formatRupiah } from '../utils/posLogic';
import { ItemCustomizerModal } from './ItemCustomizerModal';

interface MenuCatalogProps {
  items: MenuItem[];
  onQuickAddItem: (item: OrderItem) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ items, onQuickAddItem }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (item: MenuItem) => {
    if (item.isCupBeverage) {
      setCustomizingItem(item);
    } else {
      // Direct quick add for simple food/pastry
      const orderItem: OrderItem = {
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        basePrice: item.basePrice,
        unitPrice: item.basePrice,
        quantity: 1,
        isCupBeverage: false,
        customization: {},
      };
      onQuickAddItem(orderItem);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#2B1D18] text-white shadow-xs'
                : 'bg-white text-[#74665D] hover:text-[#2B1D18] border border-[#E7DED6]'
            }`}
          >
            Semua Menu
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#2B1D18] text-white shadow-xs'
                  : 'bg-white text-[#74665D] hover:text-[#2B1D18] border border-[#E7DED6]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-[#74665D] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, pastry..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B86F4B] text-[#2B1D18]"
          />
        </div>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group bg-white rounded-xl border border-[#E7DED6] p-4 flex flex-col justify-between hover:border-[#B86F4B] hover:shadow-md transition-all cursor-pointer relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm text-[#2B1D18] group-hover:text-[#B86F4B] transition-colors leading-snug">
                    {item.name}
                  </h4>
                  {item.badge && (
                    <span className="text-[10px] font-bold text-[#B86F4B] bg-[#F2E3D9] px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#74665D] line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#FAF7F3]">
                <div className="text-sm font-bold text-[#2B1D18] numeric">
                  {formatRupiah(item.basePrice)}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F3] group-hover:bg-[#B86F4B] group-hover:text-white text-[#2B1D18] text-xs font-medium flex items-center gap-1 transition-colors border border-[#E7DED6] group-hover:border-[#B86F4B]"
                  title={item.isCupBeverage ? 'Kustomisasi & Tambah' : 'Tambah Langsung'}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{item.isCupBeverage ? 'Atur' : 'Tambah'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E7DED6] p-8 text-center text-[#74665D]">
          <Coffee className="w-8 h-8 text-[#E7DED6] mx-auto mb-2" />
          <p className="text-sm font-medium">Tidak ada menu yang cocok</p>
          <p className="text-xs mt-1">Coba ubah kata kunci pencarian atau kategori filter.</p>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={onQuickAddItem}
      />
    </div>
  );
};
