/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MenuItem, Order, CartItem, OrderStatus } from './types';
import { INITIAL_MENU_ITEMS } from './data/initialMenu';
import {
  loadStoredMenu,
  saveStoredMenu,
  loadStoredOrders,
  saveStoredOrders,
  subscribeToSync,
} from './utils/sync';
import { playNewOrderChime, playSuccessChime } from './utils/audio';

import { Header } from './components/Header';
import { CustomerMenu } from './components/CustomerMenu';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminKDS } from './components/AdminKDS';
import { AdminMenuManager } from './components/AdminMenuManager';
import { AdminSalesSummary } from './components/AdminSalesSummary';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';

export default function App() {
  // Navigation & View states
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [adminTab, setAdminTab] = useState<'kds' | 'menu' | 'sales'>('kds');

  // Core Data states
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadStoredMenu());
  const [orders, setOrders] = useState<Order[]>(() => loadStoredOrders());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('kusina_cart_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Audio settings
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('kusina_sound_enabled') !== 'false';
  });

  // Keep cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kusina_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Real-time synchronization across browser tabs via BroadcastChannel
  useEffect(() => {
    const unsubscribe = subscribeToSync(
      (updatedMenu) => {
        setMenuItems(updatedMenu);
      },
      (updatedOrders, notifyNewOrder) => {
        setOrders(updatedOrders);
        if (notifyNewOrder && isSoundEnabled) {
          playNewOrderChime();
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [isSoundEnabled]);

  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    localStorage.setItem('kusina_sound_enabled', next ? 'true' : 'false');
    if (next) {
      playNewOrderChime();
    }
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, quantity: number, instructions: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.menu_item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          special_instructions: instructions || next[existingIndex].special_instructions,
        };
        return next;
      } else {
        return [...prev, { menu_item: item, quantity, special_instructions: instructions }];
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menu_item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menu_item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    saveStoredOrders(nextOrders, true);

    // Decrement servings count for ordered items
    const updatedMenu = menuItems.map((item) => {
      const ordered = newOrder.items.find((i) => i.menu_item_id === item.id);
      if (ordered) {
        const remaining = Math.max(0, item.servings_left - ordered.quantity);
        return {
          ...item,
          servings_left: remaining,
          is_available: remaining > 0 ? item.is_available : false,
        };
      }
      return item;
    });

    setMenuItems(updatedMenu);
    saveStoredMenu(updatedMenu);

    if (isSoundEnabled) {
      playNewOrderChime();
    }

    // Automatically open tracking modal
    setIsTrackerOpen(true);
  };

  // Order status management (for Kitchen Admin)
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nextOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: newStatus,
            updated_at: new Date().toISOString(),
          }
        : o
    );
    setOrders(nextOrders);
    saveStoredOrders(nextOrders);

    if (newStatus === 'completed' && isSoundEnabled) {
      playSuccessChime();
    }
  };

  const handleUpdatePaymentStatus = (
    orderId: string,
    newPaymentStatus: 'unpaid' | 'pending_verification' | 'verified'
  ) => {
    const nextOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            payment_status: newPaymentStatus,
            updated_at: new Date().toISOString(),
          }
        : o
    );
    setOrders(nextOrders);
    saveStoredOrders(nextOrders);
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'cancelled');
  };

  // Menu item availability toggles
  const handleToggleAvailability = (itemId: string) => {
    const nextMenu = menuItems.map((item) =>
      item.id === itemId ? { ...item, is_available: !item.is_available } : item
    );
    setMenuItems(nextMenu);
    saveStoredMenu(nextMenu);
  };

  const handleUpdateServings = (itemId: string, newCount: number) => {
    const nextMenu = menuItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            servings_left: newCount,
            is_available: newCount > 0 ? item.is_available : false,
          }
        : item
    );
    setMenuItems(nextMenu);
    saveStoredMenu(nextMenu);
  };

  const handleUpdatePrice = (itemId: string, newPrice: number) => {
    const nextMenu = menuItems.map((item) =>
      item.id === itemId ? { ...item, price: newPrice } : item
    );
    setMenuItems(nextMenu);
    saveStoredMenu(nextMenu);
  };

  const handleAddNewItem = (item: MenuItem) => {
    const nextMenu = [item, ...menuItems];
    setMenuItems(nextMenu);
    saveStoredMenu(nextMenu);
  };

  const handleMorningReset = () => {
    const restored = INITIAL_MENU_ITEMS.map((item) => ({
      ...item,
      is_available: true,
      servings_left: 20,
    }));
    setMenuItems(restored);
    saveStoredMenu(restored);
  };

  // Helper to simulate a live incoming customer order
  const handleSimulateNewOrder = () => {
    const sampleCustomers = [
      { name: 'Edward Garcia', phone: '0917-882-9901', type: 'pickup' as const },
      { name: 'Maria Teresa Mendoza', phone: '0920-441-2299', type: 'delivery' as const, address: 'Phase 3, Block 12 Lot 9, Jasmine St.', landmark: 'Green residential gate' },
      { name: 'Dr. Beatrice Ramos', phone: '0919-663-8812', type: 'delivery' as const, address: 'Community Health Center, 2nd Floor', landmark: 'Beside Mercury Drug' },
    ];

    const pick = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    const availableViands = menuItems.filter((i) => i.is_available && i.category === 'Viands');
    const viand1 = availableViands[0] || menuItems[0];
    const viand2 = availableViands[1] || menuItems[1];

    const simOrder: Order = {
      id: `ord-sim-${Date.now()}`,
      order_number: `KD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: pick.name,
      customer_phone: pick.phone,
      order_type: pick.type,
      delivery_address: pick.address,
      delivery_landmark: pick.landmark,
      free_soup_requested: true,
      payment_method: Math.random() > 0.4 ? 'gcash' : 'cash',
      payment_status: 'pending_verification',
      gcash_ref_number: `GC-${Math.floor(100000000 + Math.random() * 900000000)}`,
      cash_change_for: 500,
      items: [
        {
          menu_item_id: viand1.id,
          name: viand1.name,
          price: viand1.price,
          quantity: 2,
          special_instructions: 'Please include extra savory soup!',
        },
        {
          menu_item_id: 'extra-rice',
          name: 'Steamed White Rice (1 Cup)',
          price: 15,
          quantity: 3,
        },
        ...(viand2 ? [{
          menu_item_id: viand2.id,
          name: viand2.name,
          price: viand2.price,
          quantity: 1,
        }] : []),
      ],
      subtotal: viand1.price * 2 + 45 + (viand2 ? viand2.price : 0),
      delivery_fee: pick.type === 'delivery' ? 35 : 0,
      total_amount: viand1.price * 2 + 45 + (viand2 ? viand2.price : 0) + (pick.type === 'delivery' ? 35 : 0),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextOrders = [simOrder, ...orders];
    setOrders(nextOrders);
    saveStoredOrders(nextOrders, true);

    if (isSoundEnabled) {
      playNewOrderChime();
    }
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrders={activeOrders}
        onOpenTracker={() => setIsTrackerOpen(true)}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        isSoundEnabled={isSoundEnabled}
        toggleSound={toggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <CustomerMenu
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {adminTab === 'kds' && (
              <AdminKDS
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onOpenReceipt={(order) => setReceiptOrder(order)}
                onSimulateNewOrder={handleSimulateNewOrder}
                isSoundEnabled={isSoundEnabled}
                toggleSound={toggleSound}
              />
            )}
            {adminTab === 'menu' && (
              <AdminMenuManager
                menuItems={menuItems}
                onToggleAvailability={handleToggleAvailability}
                onUpdateServings={handleUpdateServings}
                onUpdatePrice={handleUpdatePrice}
                onAddNewItem={handleAddNewItem}
                onMorningReset={handleMorningReset}
              />
            )}
            {adminTab === 'sales' && (
              <AdminSalesSummary orders={orders} />
            )}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={activeOrders}
        onCancelOrder={handleCancelOrder}
      />

      {/* Printable Thermal Receipt Slip Modal */}
      <ThermalReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">Aling Nena's Kusina Express</span>
            <span aria-hidden="true">·</span>
            <span>Online Eatery & Kitchen Display System (KDS)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/kusina-express-codebase.zip"
              download="kusina-express-codebase.zip"
              className="text-neutral-700 font-semibold hover:text-amber-800 transition-colors"
            >
              Download Code (ZIP)
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView(currentView === 'customer' ? 'admin' : 'customer')}
              className="text-amber-800 font-semibold hover:underline"
            >
              {currentView === 'customer' ? 'Open Kitchen Display (Admin)' : 'Return to Customer Menu'}
            </button>
            <span aria-hidden="true">·</span>
            <span>Freshly Cooked Homestyle Food</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
