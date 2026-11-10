import { ShoppingBag, ChefHat, Bell, UtensilsCrossed } from 'lucide-react';
import { Order } from '../types';

interface HeaderProps {
  currentView: 'customer' | 'admin';
  setCurrentView: (view: 'customer' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  activeOrders: Order[];
  onOpenTracker: () => void;
  adminTab: 'kds' | 'menu' | 'sales';
  setAdminTab: (tab: 'kds' | 'menu' | 'sales') => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

export function Header({
  currentView,
  setCurrentView,
  cartCount,
  onOpenCart,
  activeOrders,
  onOpenTracker,
  adminTab,
  setAdminTab,
  isSoundEnabled,
  toggleSound,
}: HeaderProps) {
  const pendingOrdersCount = activeOrders.filter((o) => o.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('customer')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs group-hover:bg-amber-700 transition-colors">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-neutral-900 tracking-tight whitespace-nowrap">
                  Kusina Express
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-amber-700">
                  Eatery & Kitchen
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-neutral-600">
            {currentView === 'customer' ? (
              <>
                <button
                  onClick={() => setCurrentView('customer')}
                  className="px-2.5 py-1 text-neutral-900 border-b-2 border-amber-600 font-bold whitespace-nowrap"
                >
                  Today's Menu
                </button>
                {activeOrders.length > 0 && (
                  <button
                    onClick={onOpenTracker}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-amber-700 hover:text-amber-800 transition-colors whitespace-nowrap"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span>Order Tracker ({activeOrders.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors whitespace-nowrap"
                >
                  <ChefHat className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Kitchen Display (Admin)</span>
                  {pendingOrdersCount > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              /* Admin Sub-navigation */
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => setAdminTab('kds')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    adminTab === 'kds'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  KDS / Orders
                  {pendingOrdersCount > 0 && (
                    <span className="ml-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setAdminTab('menu')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    adminTab === 'menu'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Menu & Inventory
                </button>
                <button
                  onClick={() => setAdminTab('sales')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    adminTab === 'sales'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Sales & Reports
                </button>
              </div>
            )}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentView === 'admin' ? (
              <div className="flex items-center gap-2">
                <a
                  href="/kusina-express-codebase.zip"
                  download="kusina-express-codebase.zip"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
                  title="Download full project code as ZIP for Visual Studio Code"
                >
                  <span>Download Code (ZIP)</span>
                </a>
                <button
                  onClick={toggleSound}
                  title={isSoundEnabled ? 'Kitchen Bell Sound: On' : 'Kitchen Bell Sound: Off'}
                  className={`p-2 rounded-lg border transition-colors ${
                    isSoundEnabled
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-neutral-200 bg-white text-neutral-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('customer')}
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Switch to Customer View
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/kusina-express-codebase.zip"
                  download="kusina-express-codebase.zip"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
                  title="Download full project code as ZIP for Visual Studio Code"
                >
                  <span>Download Code (ZIP)</span>
                </a>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="md:hidden p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 relative"
                  title="Kitchen Display (Admin)"
                >
                  <ChefHat className="w-4 h-4" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">View Basket</span>
                  <span className="sm:hidden">Basket</span>
                  <span className="bg-amber-800 text-white px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-bold">
                    {cartCount}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
