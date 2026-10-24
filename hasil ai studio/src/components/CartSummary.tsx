import React from 'react';
import { ShoppingCart, Trash2, Gift, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Member, OrderItem, ServiceType, Voucher } from '../types/pos';
import { calculateOrderTotals, formatRupiah } from '../utils/posLogic';

interface CartSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  selectedMember: Member | null;
  voucherApplied: boolean;
  onToggleVoucher: (apply: boolean, voucher?: Voucher) => void;
  serviceType: ServiceType;
  tableNumber: string;
  takeawayName: string;
  onOpenCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedMember,
  voucherApplied,
  onToggleVoucher,
  serviceType,
  tableNumber,
  takeawayName,
  onOpenCheckout,
}) => {
  const totals = calculateOrderTotals(items, voucherApplied, 0.1);
  const availableVouchers = selectedMember?.vouchers.filter((v) => v.status === 'available') || [];

  // Service validation
  const isServiceValid = serviceType === 'dine_in' ? !!tableNumber.trim() : !!takeawayName.trim();
  const canCheckout = items.length > 0 && isServiceValid;

  return (
    <div className="bg-white rounded-2xl border border-[#E7DED6] p-4 flex flex-col h-full shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7DED6]">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#B86F4B]" />
          <h3 className="font-bold text-sm text-[#2B1D18]">Rincian Pesanan</h3>
          <span className="text-xs bg-[#FAF7F3] text-[#74665D] border border-[#E7DED6] px-2 py-0.5 rounded-full numeric">
            {items.reduce((acc, i) => acc + i.quantity, 0)} item
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-[#74665D] hover:text-[#B42318] flex items-center gap-1 transition-colors"
            title="Kosongkan Keranjang"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[160px] max-h-[360px]">
        {items.length > 0 ? (
          items.map((item) => {
            const hasOptions =
              item.customization.temperature ||
              item.customization.size ||
              item.customization.sugar ||
              item.customization.milk ||
              item.customization.extraShot;

            return (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-[#FAF7F3] border border-[#E7DED6]/70 flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-xs text-[#2B1D18]">{item.name}</h5>
                    {hasOptions && (
                      <div className="text-[11px] text-[#74665D] flex flex-wrap gap-x-1.5 items-center mt-0.5">
                        {item.customization.temperature && (
                          <span>{item.customization.temperature === 'hot' ? 'Hot' : 'Iced'}</span>
                        )}
                        {item.customization.size && (
                          <>
                            <span>·</span>
                            <span>{item.customization.size === 'large' ? 'Large 12oz' : 'Reg 8oz'}</span>
                          </>
                        )}
                        {item.customization.sugar && item.customization.sugar !== 'normal' && (
                          <>
                            <span>·</span>
                            <span>{item.customization.sugar === 'less' ? 'Less Sugar' : 'No Sugar'}</span>
                          </>
                        )}
                        {item.customization.milk && item.customization.milk !== 'fresh' && (
                          <>
                            <span>·</span>
                            <span className="capitalize">{item.customization.milk} Milk</span>
                          </>
                        )}
                        {item.customization.extraShot && (
                          <>
                            <span>·</span>
                            <span>+Extra Shot</span>
                          </>
                        )}
                      </div>
                    )}
                    {item.customization.notes && (
                      <div className="text-[10px] text-[#B86F4B] italic mt-0.5">
                        "{item.customization.notes}"
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#2B1D18] numeric">
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-[#74665D] numeric">
                        @{formatRupiah(item.unitPrice)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E7DED6]/60">
                  <span className="text-[11px] text-[#74665D]">Jumlah</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-[#E7DED6] hover:bg-[#E7DED6] flex items-center justify-center text-xs font-bold text-[#2B1D18]"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-[#2B1D18] numeric">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-white border border-[#E7DED6] hover:bg-[#E7DED6] flex items-center justify-center text-xs font-bold text-[#2B1D18]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="w-6 h-6 ml-1 text-[#74665D] hover:text-[#B42318] flex items-center justify-center"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#74665D]">
            <ShoppingCart className="w-8 h-8 text-[#E7DED6] mb-2" />
            <p className="text-xs font-medium">Keranjang masih kosong</p>
            <p className="text-[11px] text-[#74665D]/80 mt-0.5">
              Pilih menu di sebelah kiri untuk memulai pesanan.
            </p>
          </div>
        )}
      </div>

      {/* Member Voucher Banner */}
      {selectedMember && availableVouchers.length > 0 && items.length > 0 && (
        <div className="my-2 p-2.5 rounded-xl bg-[#FAF7F3] border border-[#E7DED6] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#B86F4B]" />
            <div>
              <span className="font-semibold text-[#2B1D18]">Voucher Gratis 1 Cup</span>
              <p className="text-[10px] text-[#74665D]">Tukar poin loyalitas pelanggan</p>
            </div>
          </div>
          <button
            onClick={() => onToggleVoucher(!voucherApplied, availableVouchers[0])}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              voucherApplied
                ? 'bg-[#21865B] text-white'
                : 'bg-white border border-[#B86F4B] text-[#B86F4B] hover:bg-[#B86F4B] hover:text-white'
            }`}
          >
            {voucherApplied ? (
              <>
                <Check className="w-3 h-3" />
                Terpasang
              </>
            ) : (
              'Pasang'
            )}
          </button>
        </div>
      )}

      {/* Missing table/name warning */}
      {items.length > 0 && !isServiceValid && (
        <div className="my-1.5 p-2 rounded-lg bg-[#FFF3D9] border border-[#8A5200]/20 flex items-center gap-2 text-[11px] text-[#8A5200]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {serviceType === 'dine_in'
              ? 'Harap isi Nomor Meja di bagian atas sebelum checkout.'
              : 'Harap isi Nama Pengambil di bagian atas sebelum checkout.'}
          </span>
        </div>
      )}

      {/* Totals & Calculations */}
      <div className="pt-3 border-t border-[#E7DED6] space-y-1.5 text-xs">
        <div className="flex justify-between text-[#74665D]">
          <span>Subtotal</span>
          <span className="numeric text-[#2B1D18]">{formatRupiah(totals.subtotal)}</span>
        </div>

        {voucherApplied && totals.voucherDiscount > 0 && (
          <div className="flex justify-between text-[#21865B] font-medium">
            <span>Diskon Voucher (1 Cup Gratis: {totals.freeCupItemName})</span>
            <span className="numeric">-{formatRupiah(totals.voucherDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#74665D]">
          <span>Pajak Resto (PB1 10%)</span>
          <span className="numeric text-[#2B1D18]">{formatRupiah(totals.tax)}</span>
        </div>

        <div className="flex justify-between text-sm font-bold text-[#2B1D18] pt-2 border-t border-[#E7DED6]">
          <span>Total Tagihan</span>
          <span className="numeric text-base text-[#B86F4B]">{formatRupiah(totals.total)}</span>
        </div>
      </div>

      {/* Checkout Action */}
      <button
        type="button"
        disabled={!canCheckout}
        onClick={onOpenCheckout}
        className={`mt-4 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
          canCheckout
            ? 'bg-[#2B1D18] text-white hover:bg-[#4A3027] active:scale-[0.99] cursor-pointer'
            : 'bg-[#E7DED6] text-[#74665D] cursor-not-allowed'
        }`}
      >
        <span>Lanjut ke Pembayaran</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
