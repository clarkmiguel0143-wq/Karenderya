import { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Check, Flame, Sparkles, AlertCircle } from 'lucide-react';

interface DishCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, instructions: string) => void;
  cartCount: number;
}

export function DishCard({ item, onAddToCart, cartCount }: DishCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showSpecialNote, setShowSpecialNote] = useState(false);
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAdd = () => {
    if (!item.is_available) return;
    onAddToCart(item, 1, specialInstruction);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
    setSpecialInstruction('');
    setShowSpecialNote(false);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
        item.is_available
          ? 'border-neutral-200 shadow-xs hover:border-amber-300 hover:shadow-md'
          : 'border-neutral-200/80 bg-neutral-50/70 opacity-75'
      }`}
    >
      {/* Dish Image Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              item.is_available ? 'group-hover:scale-105' : 'grayscale contrast-75'
            }`}
          />
        ) : (
          /* Styled Fallback Platter */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100/60 p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-xs border border-amber-200/70 flex items-center justify-center text-amber-700 font-display font-bold text-xl mb-1">
              {item.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-amber-900/80 tracking-wide uppercase">
              {item.category}
            </span>
          </div>
        )}

        {/* Sold Out Overlay Banner */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center p-3">
            <div className="bg-red-600 text-white px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>SOLD OUT</span>
            </div>
          </div>
        )}

        {/* Bestseller Badge */}
        {item.is_available && item.is_best_seller && (
          <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Bestseller</span>
          </div>
        )}

        {/* Spiciness indicator if applicable */}
        {item.spiciness === 'spicy' && item.is_available && (
          <div className="absolute top-2.5 right-2.5 bg-red-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>Spicy</span>
          </div>
        )}
      </div>

      {/* Dish Content Body */}
      <div className="flex flex-col flex-1 p-4 justify-between">
        <div>
          {/* Metadata: Category & Servings */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="font-medium text-neutral-700">{item.category}</span>
            {item.is_available && item.servings_left > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className={item.servings_left <= 5 ? 'text-amber-700 font-medium' : ''}>
                  {item.servings_left} portions left
                </span>
              </>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="font-display font-bold text-base text-neutral-900 tracking-tight leading-snug">
            {item.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-amber-900/90 italic font-medium mt-0.5 line-clamp-1">
            {item.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Controls */}
        <div className="pt-3 mt-3 border-t border-neutral-100">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Price</div>
              <div className="font-display font-extrabold text-lg text-neutral-900 tabular-nums">
                {item.price === 0 ? (
                  <span className="text-emerald-700 text-base">FREE</span>
                ) : (
                  <>₱{item.price.toFixed(2)}</>
                )}
              </div>
            </div>

            {/* Action Button */}
            {item.is_available ? (
              <div className="flex items-center gap-1.5">
                {cartCount > 0 && (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-1 rounded-md tabular-nums">
                    {cartCount} in cart
                  </span>
                )}
                <button
                  onClick={handleAdd}
                  className={`flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors active:scale-95 whitespace-nowrap ${
                    isAddedRecently
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  }`}
                  aria-label={`Add ${item.name}`}
                >
                  {isAddedRecently ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-200/60 rounded-lg cursor-not-allowed whitespace-nowrap"
              >
                Sold Out
              </button>
            )}
          </div>

          {/* Optional Special Instructions Toggle */}
          {item.is_available && item.category === 'Viands' && (
            <div className="mt-2 pt-2 border-t border-neutral-100/60">
              {!showSpecialNote ? (
                <button
                  onClick={() => setShowSpecialNote(true)}
                  className="text-[11px] text-neutral-500 hover:text-amber-700 transition-colors underline-offset-2 hover:underline"
                >
                  + Add special note for the kitchen
                </button>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={specialInstruction}
                    onChange={(e) => setSpecialInstruction(e.target.value)}
                    placeholder="e.g., Extra broth, separate chili, less oil..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                  <div className="flex items-center justify-end gap-2 text-[10px]">
                    <button
                      onClick={() => {
                        setShowSpecialNote(false);
                        setSpecialInstruction('');
                      }}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      className="text-amber-700 font-semibold hover:text-amber-800"
                    >
                      Save & Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
