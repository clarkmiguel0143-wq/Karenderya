import { Order } from '../types';
import { Printer, X } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export function ThermalReceiptModal({ order, onClose }: ThermalReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Kitchen Order Slip / Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 80mm Printable Receipt Area */}
        <div className="p-6 bg-neutral-50 overflow-y-auto max-h-[75vh]">
          <div
            id="thermal-receipt-area"
            className="bg-white p-5 shadow-xs border border-neutral-200 font-mono text-xs text-neutral-800 space-y-3 mx-auto max-w-[280px]"
          >
            {/* Store Header */}
            <div className="text-center border-b border-dashed border-neutral-300 pb-3 space-y-0.5">
              <h2 className="font-bold text-sm tracking-wider uppercase text-neutral-900 font-display">
                ALING NENA'S KITCHEN
              </h2>
              <p className="text-[10px] text-neutral-500">Homestyle Eatery & Takeout</p>
              <p className="text-[10px] text-neutral-500">#42 Maligaya St., Brgy. San Jose</p>
              <p className="text-[10px] text-neutral-500">Tel / GCash: 0917-823-4567</p>
            </div>

            {/* Slip Meta */}
            <div className="text-[11px] space-y-1 border-b border-dashed border-neutral-300 pb-2">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>ORDER: {order.order_number}</span>
                <span className="uppercase">{order.order_type}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Date:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Customer:</span>
                <span className="font-medium text-neutral-900 truncate max-w-[150px]">{order.customer_name}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phone:</span>
                <span>{order.customer_phone}</span>
              </div>
              {order.delivery_address && (
                <div className="pt-1 text-[10px] text-neutral-600">
                  <span className="font-semibold text-neutral-800">Address: </span>
                  {order.delivery_address}
                  {order.delivery_landmark && (
                    <div className="italic text-neutral-500">Landmark: {order.delivery_landmark}</div>
                  )}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-1.5 border-b border-dashed border-neutral-300 pb-2.5">
              <div className="flex justify-between font-bold text-[10px] text-neutral-500 pb-1 border-b border-neutral-200">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="tabular-nums">₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.special_instructions && (
                    <div className="text-[10px] italic text-amber-700 pl-3">
                      * {item.special_instructions}
                    </div>
                  )}
                </div>
              ))}
              {order.free_soup_requested && (
                <div className="flex justify-between items-center text-emerald-700 italic text-[11px]">
                  <span>+ Complimentary Hot Broth</span>
                  <span>FREE</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-neutral-300 pb-2">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="tabular-nums">₱{order.subtotal.toFixed(2)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Rider Fee:</span>
                  <span className="tabular-nums">₱{order.delivery_fee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                <span>TOTAL:</span>
                <span className="tabular-nums text-base">₱{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-[10px] text-neutral-600 space-y-1 border-b border-dashed border-neutral-300 pb-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold uppercase text-neutral-900">{order.payment_method}</span>
              </div>
              {order.payment_method === 'cash' && order.cash_change_for && (
                <div className="flex justify-between text-neutral-700">
                  <span>Change for:</span>
                  <span className="font-semibold">₱{order.cash_change_for} (Change: ₱{(order.cash_change_for - order.total_amount).toFixed(2)})</span>
                </div>
              )}
              {order.gcash_ref_number && (
                <div className="flex justify-between text-neutral-700">
                  <span>GCash Ref No:</span>
                  <span className="font-semibold">{order.gcash_ref_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="capitalize font-semibold text-emerald-700">
                  {order.payment_status === 'verified' ? 'Paid (Verified)' : 'Pending Payment'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-1 text-[10px] text-neutral-500 space-y-0.5">
              <p className="font-semibold text-neutral-700">Thank you for your patronage!</p>
              <p>Fresh, Delicious Homestyle Food</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
