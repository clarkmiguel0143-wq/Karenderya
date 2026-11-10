import { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { 
  Bell, 
  Printer, 
  Check, 
  ArrowRight, 
  Clock, 
  Bike, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Phone
} from 'lucide-react';
import { playNewOrderChime } from '../utils/audio';

interface AdminKDSProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, newPaymentStatus: 'unpaid' | 'pending_verification' | 'verified') => void;
  onOpenReceipt: (order: Order) => void;
  onSimulateNewOrder: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

export function AdminKDS({
  orders,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onOpenReceipt,
  onSimulateNewOrder,
  isSoundEnabled,
  toggleSound,
}: AdminKDSProps) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getMinutesAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 min ago';
    return `${diff} mins ago`;
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* KDS Dashboard Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>New / Pending</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('preparing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'preparing'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <span>Preparing</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
              {preparingCount}
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('ready')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <span>Ready</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
              {readyCount}
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'completed'
                ? 'bg-neutral-800 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Quick KDS Tools & Simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playNewOrderChime();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
            title="Test the kitchen bell chime sound"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Test Kitchen Chime</span>
          </button>

          <button
            onClick={onSimulateNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Simulate New Order</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-dashed border-neutral-200">
          <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <h3 className="font-display font-bold text-base text-neutral-800">
            No orders in this status
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Wait for incoming customer orders or click "+ Simulate New Order" to test.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isPreparing = order.status === 'preparing';
            const isReady = order.status === 'ready';
            const isCompleted = order.status === 'completed';

            return (
              <div
                key={order.id}
                className={`flex flex-col bg-white rounded-xl border shadow-xs transition-all ${
                  isPending
                    ? 'border-amber-400 ring-2 ring-amber-100'
                    : isPreparing
                    ? 'border-blue-300'
                    : isReady
                    ? 'border-emerald-300'
                    : 'border-neutral-200 opacity-80'
                }`}
              >
                {/* Order Top Bar */}
                <div
                  className={`p-4 border-b flex items-start justify-between gap-3 ${
                    isPending
                      ? 'bg-amber-50/60 border-amber-200'
                      : isPreparing
                      ? 'bg-blue-50/50 border-blue-100'
                      : isReady
                      ? 'bg-emerald-50/50 border-emerald-100'
                      : 'bg-neutral-50/80 border-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-neutral-900">
                        {order.order_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          order.order_type === 'delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {order.order_type === 'delivery' ? 'Delivery' : 'Pickup (Takeout)'}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{getMinutesAgo(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Receipt & Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 transition-colors"
                      title="View & Print Order Receipt Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-900">{order.customer_name}</span>
                    <span className="text-neutral-500 ml-2 font-mono">{order.customer_phone}</span>
                  </div>
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                {/* Delivery Address (if Delivery) */}
                {order.order_type === 'delivery' && order.delivery_address && (
                  <div className="px-4 py-2 bg-purple-50/50 border-b border-purple-100 text-xs text-purple-900">
                    <div className="font-semibold flex items-center gap-1">
                      <Bike className="w-3 h-3" />
                      <span>Delivery: {order.delivery_address}</span>
                    </div>
                    {order.delivery_landmark && (
                      <div className="text-[11px] text-purple-700 italic pl-4">
                        Landmark: {order.delivery_landmark}
                      </div>
                    )}
                  </div>
                )}

                {/* Items List */}
                <div className="p-4 flex-1 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Kitchen Prep Items
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                        <div className="flex justify-between items-baseline font-bold text-neutral-900">
                          <span className="text-sm">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-mono text-neutral-600 tabular-nums font-semibold">
                            ₱{(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                        {it.special_instructions && (
                          <div className="mt-1 text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                            * {it.special_instructions}
                          </div>
                        )}
                      </div>
                    ))}

                    {order.free_soup_requested && (
                      <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                        <span>+ Complimentary Savory Broth</span>
                        <span>FREE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Status & Total Box */}
                <div className="px-4 py-3 bg-neutral-50/80 border-t border-neutral-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-neutral-700 capitalize">
                        {order.payment_method === 'cash' ? 'Cash Payment' : 'GCash / Maya'}
                      </span>
                      {order.payment_method === 'cash' && order.cash_change_for && (
                        <div className="text-[10px] text-neutral-500 font-medium">
                          Change for ₱{order.cash_change_for} (Change: ₱{(order.cash_change_for - order.total_amount).toFixed(2)})
                        </div>
                      )}
                      {order.gcash_ref_number && (
                        <div className="text-[10px] text-blue-700 font-mono font-semibold">
                          Ref: {order.gcash_ref_number}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-display font-black text-base text-neutral-900 tabular-nums">
                        ₱{order.total_amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() =>
                          onUpdatePaymentStatus(
                            order.id,
                            order.payment_status === 'verified' ? 'unpaid' : 'verified'
                          )
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                          order.payment_status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        {order.payment_status === 'verified' ? '✓ Paid (Verified)' : 'Mark as Paid'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Big Kitchen Action Buttons */}
                <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                      className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Accept & Start Prep</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark as Ready</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered / Picked Up</span>
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex-1 py-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
                      ✓ Order Completed
                    </div>
                  )}

                  {!isCompleted && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                      className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel order"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
