import { useState, useMemo } from 'react';
import { MenuItem, DishCategory, CartItem } from '../types';
import { DishCard } from './DishCard';
import { Search, Sparkles, Soup, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface CustomerMenuProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem, quantity: number, instructions: string) => void;
  onOpenCart: () => void;
}

export function CustomerMenu({
  menuItems,
  cart,
  onAddToCart,
  onOpenCart,
}: CustomerMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const categories: (DishCategory | 'All')[] = [
    'All',
    'Viands',
    'Rice',
    'Drinks',
    'Desserts',
    'Soup',
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Available only filter
      if (availableOnly && !item.is_available) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesSubtitle || matchesDesc;
      }
      return true;
    });
  }, [menuItems, selectedCategory, availableOnly, searchQuery]);

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCartPrice = cart.reduce((acc, curr) => acc + curr.menu_item.price * curr.quantity, 0);

  const getCartCountForItem = (itemId: string) => {
    const found = cart.find((c) => c.menu_item.id === itemId);
    return found ? found.quantity : 0;
  };

  const soldOutCount = menuItems.filter((i) => !i.is_available).length;

  return (
    <div className="pb-24">
      {/* Eatery Hero Banner */}
      <section className="bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-transparent border-b border-neutral-200/60 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-2">
                <span>Aling Nena's Homestyle Kitchen & Eatery</span>
                <span aria-hidden="true">·</span>
                <span>Est. 2012</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-bold">Open Today</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
                Freshly Cooked Homestyle Dishes Every Day!
              </h1>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Choose from hearty, comforting Filipino favorites: Sinigang, Adobo, Kare-Kare, and piping-hot broths.
                Order for fast local doorstep delivery or quick pickup at our kitchen counter.
              </p>

              {/* Service Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>7:00 AM – 8:30 PM (Quick Service)</span>
                </div>
                <span aria-hidden="true" className="text-neutral-300">|</span>
                <div className="flex items-center gap-1.5">
                  <Soup className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-medium text-amber-900">Free Hot Soup with Every Viand</span>
                </div>
                <span aria-hidden="true" className="text-neutral-300">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cash on Delivery & GCash Accepted</span>
                </div>
              </div>
            </div>

            {/* Quick Location & Delivery Notice Card */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs max-w-xs shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Kitchen Location</span>
              </div>
              <p className="mt-1 text-xs text-neutral-600">
                #42 Maligaya St., Brgy. San Jose, Quezon City
              </p>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Local Delivery:</span>
                <span className="font-semibold text-neutral-900">Flat ₱35 Rider Fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Controls Toolbar: Categories, Search & Sold Out Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {cat === 'All' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Search Input & Available Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, rice, drinks..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sold out toggle */}
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                availableOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Available Only ({menuItems.length - soldOutCount})</span>
            </button>
          </div>
        </div>

        {/* Status Notice if some items are sold out */}
        {soldOutCount > 0 && !availableOnly && (
          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 bg-neutral-100/70 px-4 py-2 rounded-lg">
            <span>
              Notice: <strong className="text-neutral-800 font-semibold">{soldOutCount}</strong> {soldOutCount === 1 ? 'item is' : 'items are'} currently sold out for today.
            </span>
            <button
              onClick={() => setAvailableOnly(true)}
              className="text-amber-800 font-semibold hover:underline"
            >
              Hide sold out items
            </button>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredItems.map((item) => (
              <DishCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                cartCount={getCartCountForItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-xl border border-dashed border-neutral-200 mt-6">
            <Soup className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-neutral-800">
              No dishes found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or category selection to see other daily menu options.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setAvailableOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Mobile Sticky Cart Summary */}
      {totalCartItems > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-xl z-30">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="leading-tight">
              <div className="text-[11px] text-neutral-500">
                {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} in basket
              </div>
              <div className="font-display font-extrabold text-base text-neutral-900 tabular-nums">
                ₱{totalCartPrice.toFixed(2)}
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="flex-1 max-w-[200px] py-2.5 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs flex items-center justify-center gap-2"
            >
              <span>Checkout</span>
              <span className="bg-amber-800 text-white text-[10px] px-1.5 py-0.5 rounded-full tabular-nums">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
