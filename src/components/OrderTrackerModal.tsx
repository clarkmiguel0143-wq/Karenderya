import { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { X, CheckCircle, Clock, Bike, Phone, AlertCircle, ShoppingBag } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

export function OrderTrackerModal({
  isOpen,
  onClose,
  orders,
  onCancelOrder,
}: OrderTrackerModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );

  if (!isOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const steps = [
    { step: 1, title: 'Received', desc: 'Kitchen accepted' },
    { step: 2, title: 'Preparing', desc: 'Packing food hot' },
    { step: 3, title: 'Ready / On Way', desc: 'Pickup or rider' },
    { step: 4, title: 'Completed', desc: 'Enjoy your meal!' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-base">
              Live Order Tracker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Order Tabs */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 overflow-x-auto">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrderId(o.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  currentOrder?.id === o.id
                    ? 'bg-white text-neutral-900 shadow-xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {o.order_number} ({o.status})
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!currentOrder ? (
            <div className="py-12 text-center text-neutral-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
              <p className="text-sm">No active orders found.</p>
            </div>
          ) : (
            <>
              {/* Order Banner & Status Hero */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-900/80 font-medium">
                    <span>Order No:</span>
                    <strong className="font-mono text-neutral-900 text-sm font-bold">
                      {currentOrder.order_number}
                    </strong>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{currentOrder.order_type}</span>
                  </div>
                  <h3 className="font-display font-black text-xl text-neutral-900 mt-1">
                    {currentOrder.status === 'pending' && 'Order received by the kitchen!'}
                    {currentOrder.status === 'preparing' && 'Kitchen is preparing & packing hot dishes...'}
                    {currentOrder.status === 'ready' &&
                      (currentOrder.order_type === 'delivery'
                        ? 'Rider is en route to your address!'
                        : 'Your order is ready for pickup at the counter!')}
                    {currentOrder.status === 'completed' && 'Order completed. Thank you for your patronage!'}
                    {currentOrder.status === 'cancelled' && 'This order has been cancelled.'}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Estimated prep & packing time: <strong>10–15 minutes</strong>
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-amber-200 sm:pl-4">
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total</div>
                  <div className="font-display font-black text-xl text-amber-800 tabular-nums">
                    ₱{currentOrder.total_amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold mt-0.5">
                    {currentOrder.payment_method === 'cash' ? 'Cash' : 'GCash'} (
                    {currentOrder.payment_status === 'verified' ? 'Verified' : 'Pending Verification'})
                  </div>
                </div>
              </div>

              {/* Progress Stepper Visualizer */}
              {currentOrder.status !== 'cancelled' ? (
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />
                    <div
                      className="absolute top-4 left-6 h-0.5 bg-amber-600 transition-all duration-500 -z-0"
                      style={{
                        width: `${Math.min(100, Math.max(0, (getStatusStep(currentOrder.status) - 1) * 33.3))}%`,
                      }}
                    />

                    {steps.map((st) => {
                      const isActive = getStatusStep(currentOrder.status) >= st.step;
                      const isCurrent = getStatusStep(currentOrder.status) === st.step;

                      return (
                        <div key={st.step} className="flex flex-col items-center text-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isActive
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-neutral-200 text-neutral-500'
                            } ${isCurrent ? 'ring-4 ring-amber-100' : ''}`}
                          >
                            {isActive ? <CheckCircle className="w-4 h-4" /> : st.step}
                          </div>
                          <div className="mt-2">
                            <div className="text-[11px] font-bold text-neutral-900 leading-tight">
                              {st.title}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5 hidden sm:block">
                              {st.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>This order has been cancelled. You may browse the menu to order again.</span>
                </div>
              )}

              {/* Order Itemized Summary */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Ordered Dishes & Items
                </h4>
                <div className="border border-neutral-200 rounded-xl p-4 divide-y divide-neutral-100 bg-white">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start text-xs">
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {item.quantity}x {item.name}
                        </div>
                        {item.special_instructions && (
                          <div className="text-[11px] text-amber-800 italic mt-0.5">
                            Kitchen Note: {item.special_instructions}
                          </div>
                        )}
                      </div>
                      <div className="tabular-nums font-medium text-neutral-900">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {currentOrder.free_soup_requested && (
                    <div className="py-2.5 text-xs flex justify-between items-center text-emerald-700">
                      <span>Complimentary Savory Broth</span>
                      <span className="font-semibold uppercase text-[11px]">Free</span>
                    </div>
                  )}

                  {currentOrder.delivery_fee > 0 && (
                    <div className="py-2.5 text-xs flex justify-between items-center text-neutral-600">
                      <span>Local Delivery Rider Fee</span>
                      <span className="tabular-nums font-medium text-neutral-900">₱{currentOrder.delivery_fee.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Details if applicable */}
              {currentOrder.order_type === 'delivery' && currentOrder.delivery_address && (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                    <Bike className="w-4 h-4 text-amber-600" />
                    <span>Delivery Location</span>
                  </div>
                  <p className="text-neutral-700 font-medium">{currentOrder.delivery_address}</p>
                  {currentOrder.delivery_landmark && (
                    <p className="text-neutral-500 italic">Landmark: {currentOrder.delivery_landmark}</p>
                  )}
                </div>
              )}

              {/* Actions & Kitchen Contact */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200">
                <a
                  href="tel:09178234567"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Call Kitchen (0917-823-4567)</span>
                </a>

                {currentOrder.status === 'pending' && (
                  <button
                    onClick={() => onCancelOrder(currentOrder.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
