import React, { useState } from 'react';
import { Coffee, Plus, Search, Edit3, CheckCircle, XCircle, Tag, DollarSign, X } from 'lucide-react';
import { CategoryId, InventoryItem, MenuItem } from '../types/pos';
import { CATEGORIES } from '../data/mockData';
import { calculateProfitMargin, formatRupiah } from '../utils/posLogic';

interface MenuManagementViewProps {
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  onToggleAvailability: (itemId: string) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onUpdateMenuItem: (updatedItem: MenuItem) => void;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  menuItems,
  inventory,
  onToggleAvailability,
  onAddMenuItem,
  onUpdateMenuItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>('espresso');
  const [basePrice, setBasePrice] = useState('28000');
  const [costPrice, setCostPrice] = useState('9000');
  const [description, setDescription] = useState('');
  const [isCupBeverage, setIsCupBeverage] = useState(true);

  const filtered = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      basePrice: parseInt(basePrice, 10) || 0,
      costPrice: parseInt(costPrice, 10) || 0,
      description: description.trim() || 'Menu specialty coffee terbaru dari roastery.',
      isCupBeverage,
      isAvailable: true,
      salesCount: 0,
      recipe: [
        { ingredientId: 'beans-house', name: 'House Blend', amount: 18, unit: 'g' },
        { ingredientId: 'cup-regular', name: 'Cup Regular', amount: 1, unit: 'pcs' },
      ],
    };

    onAddMenuItem(newItem);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86F4B]">
            Catalog & Margin Engineering
          </div>
          <h2 className="text-xl font-bold text-[#2B1D18] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#B86F4B]" />
            Daftar Menu, Harga & HPP (Costing)
          </h2>
          <p className="text-xs text-[#74665D] mt-0.5">
            Kelola katalog produk, pantau persentase margin keuntungan kotor, dan ketersediaan menu.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#B86F4B] hover:bg-[#a35e3c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#2B1D18] text-white shadow-xs'
                : 'bg-white text-[#74665D] hover:text-[#2B1D18] border border-[#E7DED6]'
            }`}
          >
            Semua ({menuItems.length})
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

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-[#74665D] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu kopi, pastry..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E7DED6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B86F4B] text-[#2B1D18]"
          />
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl border border-[#E7DED6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F3] text-[#74665D] font-semibold border-b border-[#E7DED6]">
              <tr>
                <th className="py-3 px-4">Nama Menu & Kategori</th>
                <th className="py-3 px-4">Harga Jual</th>
                <th className="py-3 px-4">HPP (Cost)</th>
                <th className="py-3 px-4 text-center">Margin %</th>
                <th className="py-3 px-4 text-center">Tipe Minuman</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F3]">
              {filtered.map((item) => {
                const margin = calculateProfitMargin(item.basePrice, item.costPrice);

                return (
                  <tr key={item.id} className="hover:bg-[#FAF7F3]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-[#2B1D18]">{item.name}</div>
                      <div className="text-[11px] text-[#74665D] capitalize mt-0.5">
                        {item.category.replace('_', ' ')} · {item.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#2B1D18] numeric text-sm">
                      {formatRupiah(item.basePrice)}
                    </td>
                    <td className="py-3 px-4 text-[#74665D] numeric">
                      {formatRupiah(item.costPrice)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#E7F5ED] text-[#21865B] font-bold text-xs numeric">
                        {margin}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          item.isCupBeverage
                            ? 'bg-[#EAF3FC] text-[#2768A8]'
                            : 'bg-[#FAF7F3] text-[#74665D] border border-[#E7DED6]'
                        }`}
                      >
                        {item.isCupBeverage ? 'Cup Minuman (10-Stamp)' : 'Food / Pastry'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          item.isAvailable
                            ? 'bg-[#E7F5ED] text-[#21865B] hover:bg-[#FCEAE8] hover:text-[#B42318]'
                            : 'bg-[#FCEAE8] text-[#B42318] hover:bg-[#E7F5ED] hover:text-[#21865B]'
                        }`}
                        title="Klik untuk ubah ketersediaan"
                      >
                        {item.isAvailable ? '✓ Tersedia' : '✕ Habis'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleAvailability(item.id)}
                        className="px-2.5 py-1 text-xs bg-[#FAF7F3] hover:bg-[#E7DED6] text-[#2B1D18] rounded-lg border border-[#E7DED6] font-semibold"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Menu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-xl w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7DED6]">
              <h3 className="font-bold text-base text-[#2B1D18] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B86F4B]" />
                Tambah Menu Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#74665D] hover:text-[#2B1D18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Sea Salt Caramel Cold Brew"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl numeric"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                    Estimasi HPP / Modal (Rp)
                  </label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl numeric"
                    required
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2B1D18]">
                    <input
                      type="checkbox"
                      checked={isCupBeverage}
                      onChange={(e) => setIsCupBeverage(e.target.checked)}
                      className="rounded text-[#B86F4B] focus:ring-[#B86F4B]"
                    />
                    <span>Minuman Cup (Ikut 10-Cup Stamp)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2B1D18] block mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan rasa, biji kopi, atau profil seduhan..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#74665D] hover:bg-[#FAF7F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-xl shadow-xs"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
