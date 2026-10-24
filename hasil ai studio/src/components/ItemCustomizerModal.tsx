import React, { useState } from 'react';
import { X, Flame, Snowflake, Plus, Check } from 'lucide-react';
import { MenuItem, OrderItem, OrderItemCustomization } from '../types/pos';
import { calculateItemUnitPrice, formatRupiah } from '../utils/posLogic';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (customizedItem: OrderItem) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [temperature, setTemperature] = useState<'hot' | 'iced'>('iced');
  const [size, setSize] = useState<'regular' | 'large'>('regular');
  const [sugar, setSugar] = useState<'normal' | 'less' | 'none'>('normal');
  const [milk, setMilk] = useState<'fresh' | 'oat' | 'almond'>('fresh');
  const [extraShot, setExtraShot] = useState(false);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const customization: OrderItemCustomization = {
    temperature,
    size,
    sugar,
    milk: item.category === 'espresso' || item.category === 'milk_tea' || item.category === 'seasonal' ? milk : undefined,
    extraShot,
    notes: notes.trim() || undefined,
  };

  const unitPrice = calculateItemUnitPrice(item.basePrice, customization);
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const orderItem: OrderItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      unitPrice,
      quantity,
      isCupBeverage: item.isCupBeverage,
      customization,
    };
    onAddToCart(orderItem);
    onClose();
  };

  const hasMilkOptions = item.category === 'espresso' || item.category === 'milk_tea' || item.category === 'seasonal';

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E7DED6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E7DED6] flex items-start justify-between bg-[#FAF7F3]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#B86F4B] font-semibold">
              Kustomisasi Minuman
            </div>
            <h3 className="text-lg font-bold text-[#2B1D18]">{item.name}</h3>
            <p className="text-xs text-[#74665D] mt-0.5 line-clamp-2">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#74665D] hover:text-[#2B1D18] hover:bg-[#E7DED6]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Suhu / Temperature */}
          <div>
            <label className="text-xs font-semibold text-[#2B1D18] mb-1.5 block">Suhu Minuman</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemperature('hot')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                  temperature === 'hot'
                    ? 'bg-[#B86F4B] text-white border-[#B86F4B]'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Panas (Hot)</span>
              </button>
              <button
                type="button"
                onClick={() => setTemperature('iced')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                  temperature === 'iced'
                    ? 'bg-[#B86F4B] text-white border-[#B86F4B]'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <Snowflake className="w-4 h-4 text-sky-400" />
                <span>Dingin (Iced)</span>
              </button>
            </div>
          </div>

          {/* Ukuran Cup / Size */}
          <div>
            <label className="text-xs font-semibold text-[#2B1D18] mb-1.5 block">Ukuran Cup</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSize('regular')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                  size === 'regular'
                    ? 'bg-[#4A3027] text-white border-[#4A3027]'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <span>Regular (8oz)</span>
                <span className="text-[11px] opacity-80">Standar</span>
              </button>
              <button
                type="button"
                onClick={() => setSize('large')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                  size === 'large'
                    ? 'bg-[#4A3027] text-white border-[#4A3027]'
                    : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                }`}
              >
                <span>Large (12oz)</span>
                <span className="text-[11px] opacity-80">+Rp5.000</span>
              </button>
            </div>
          </div>

          {/* Level Gula / Sweetness */}
          <div>
            <label className="text-xs font-semibold text-[#2B1D18] mb-1.5 block">Tingkat Manis</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Normal (100%)' },
                { id: 'less', label: 'Less Sugar (50%)' },
                { id: 'none', label: 'Tanpa Gula (0%)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSugar(s.id as any)}
                  className={`py-2 px-2 text-center rounded-lg border text-xs font-medium transition-colors ${
                    sugar === s.id
                      ? 'bg-[#B86F4B] text-white border-[#B86F4B]'
                      : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Susu (Milk Choice) */}
          {hasMilkOptions && (
            <div>
              <label className="text-xs font-semibold text-[#2B1D18] mb-1.5 block">Pilihan Susu</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fresh', label: 'Fresh Milk', extra: '+0' },
                  { id: 'oat', label: 'Oat Milk', extra: '+Rp8k' },
                  { id: 'almond', label: 'Almond Milk', extra: '+Rp10k' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMilk(m.id as any)}
                    className={`py-2 px-2 text-center rounded-lg border text-xs font-medium transition-colors ${
                      milk === m.id
                        ? 'bg-[#4A3027] text-white border-[#4A3027]'
                        : 'bg-[#FAF7F3] text-[#2B1D18] border-[#E7DED6] hover:bg-[#F2E3D9]'
                    }`}
                  >
                    <div>{m.label}</div>
                    <div className="text-[10px] opacity-75">{m.extra}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tambahan Espresso Shot */}
          <div className="flex items-center justify-between p-3 bg-[#FAF7F3] border border-[#E7DED6] rounded-lg">
            <div>
              <div className="text-xs font-semibold text-[#2B1D18]">Extra Espresso Shot</div>
              <div className="text-[11px] text-[#74665D]">Tambahan 1 shot espresso pekat (+Rp5.000)</div>
            </div>
            <button
              type="button"
              onClick={() => setExtraShot(!extraShot)}
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                extraShot
                  ? 'bg-[#B86F4B] border-[#B86F4B] text-white'
                  : 'bg-white border-[#E7DED6] text-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Catatan Barista */}
          <div>
            <label className="text-xs font-semibold text-[#2B1D18] mb-1 block">
              Catatan Barista (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Ekstra es batu, pisahkan gula, dll."
              className="w-full px-3 py-2 text-xs bg-[#FAF7F3] border border-[#E7DED6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B86F4B]"
            />
          </div>

          {/* Jumlah Kuantitas */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#2B1D18]">Jumlah Porsi</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-[#FAF7F3] border border-[#E7DED6] hover:bg-[#E7DED6] flex items-center justify-center font-bold text-sm text-[#2B1D18]"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-base text-[#2B1D18] numeric">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-[#FAF7F3] border border-[#E7DED6] hover:bg-[#E7DED6] flex items-center justify-center font-bold text-sm text-[#2B1D18]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer with total price & Add action */}
        <div className="p-4 border-t border-[#E7DED6] bg-[#FAF7F3] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#74665D]">Total Item</div>
            <div className="text-lg font-bold text-[#2B1D18] numeric">
              {formatRupiah(totalPrice)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-[#74665D] hover:bg-[#E7DED6]/50 rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B86F4B] hover:bg-[#a35e3c] rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan ke Pesanan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
