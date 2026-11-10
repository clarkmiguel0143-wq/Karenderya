import { MenuItem, Order } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/initialMenu';
import { INITIAL_ORDERS } from '../data/initialOrders';

const MENU_STORAGE_KEY = 'kusina_menu_items_v1';
const ORDERS_STORAGE_KEY = 'kusina_orders_v1';
const SYNC_CHANNEL_NAME = 'kusina_sync_channel';

// Get channel if available
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment', e);
}

export function loadStoredMenu(): MenuItem[] {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading menu from localStorage', e);
  }
  saveStoredMenu(INITIAL_MENU_ITEMS);
  return INITIAL_MENU_ITEMS;
}

export function saveStoredMenu(items: MenuItem[]) {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    if (channel) {
      channel.postMessage({ type: 'MENU_UPDATED', items });
    }
  } catch (e) {
    console.error('Failed saving menu to localStorage', e);
  }
}

export function loadStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading orders from localStorage', e);
  }
  saveStoredOrders(INITIAL_ORDERS);
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders: Order[], notifyNewOrder: boolean = false) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    if (channel) {
      channel.postMessage({ type: 'ORDERS_UPDATED', orders, notifyNewOrder });
    }
  } catch (e) {
    console.error('Failed saving orders to localStorage', e);
  }
}

export function subscribeToSync(
  onMenuUpdated: (items: MenuItem[]) => void,
  onOrdersUpdated: (orders: Order[], notifyNewOrder?: boolean) => void
) {
  if (!channel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'MENU_UPDATED' && Array.isArray(event.data.items)) {
      onMenuUpdated(event.data.items);
    } else if (event.data?.type === 'ORDERS_UPDATED' && Array.isArray(event.data.orders)) {
      onOrdersUpdated(event.data.orders, event.data.notifyNewOrder);
    }
  };

  channel.addEventListener('message', handler);
  return () => {
    channel?.removeEventListener('message', handler);
  };
}
