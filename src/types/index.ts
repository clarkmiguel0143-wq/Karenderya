export type DishCategory = 'Viands' | 'Rice' | 'Drinks' | 'Desserts' | 'Soup';

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image_url: string;
  category: DishCategory;
  is_available: boolean;
  servings_left: number;
  is_best_seller?: boolean;
  spiciness?: 'mild' | 'spicy' | 'none';
  date_added: string;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'gcash' | 'maya';
export type OrderType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address?: string;
  delivery_landmark?: string;
  free_soup_requested: boolean;
  payment_method: PaymentMethod;
  payment_status: 'unpaid' | 'pending_verification' | 'verified';
  gcash_ref_number?: string;
  cash_change_for?: number | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  customer_notes?: string;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions: string;
}
