import { useState } from 'react';
import { CartItem, Order, OrderType, PaymentMethod } from '../types';
import { X, Trash2, Plus, Minus, QrCode, Bike, ShoppingBag, CheckCircle, Upload, AlertCircle, Soup } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [freeSoup, setFreeSoup] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashChangeFor, setCashChangeFor] = useState<number | null>(null);
  const [gcashRefNumber, setGcashRefNumber] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [mockScreenshotAttached, setMockScreenshotAttached] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, curr) => acc + curr.menu_item.price * curr.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 35 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your basket is empty.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Please provide your name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      setFormError('Please enter a valid mobile phone number for delivery/pickup updates.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please provide your exact delivery address.');
      return;
    }

    if (paymentMethod === 'gcash' && !gcashRefNumber.trim()) {
      setFormError('Please enter the GCash / Maya Reference Number after sending payment.');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderNumber = `KD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: generatedOrderNumber,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      order_type: orderType,
      delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      delivery_landmark: orderType === 'delivery' && deliveryLandmark.trim() ? deliveryLandmark.trim() : undefined,
      free_soup_requested: freeSoup,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'gcash' ? 'pending_verification' : 'unpaid',
      gcash_ref_number: paymentMethod === 'gcash' ? gcashRefNumber.trim() : undefined,
      cash_change_for: paymentMethod === 'cash' ? cashChangeFor : undefined,
      items: cart.map((c) => ({
        menu_item_id: c.menu_item.id,
        name: c.menu_item.name,
        price: c.menu_item.price,
        quantity: c.quantity,
        special_instructions: c.special_instructions,
      })),
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="font-display font-bold text-lg text-neutral-900">
              Basket & Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors"
            aria-label="Close basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-700">Your basket is empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Choose from our freshly cooked viands, rice, and cold drinks to begin your order.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <span>Selected Items</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-600 hover:text-red-700 lowercase font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>clear all</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
                  {cart.map((c) => (
                    <div key={c.menu_item.id} className="p-3.5 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-neutral-900 truncate">
                          {c.menu_item.name}
                        </h4>
                        <div className="text-xs text-neutral-500 tabular-nums">
                          ₱{c.menu_item.price.toFixed(2)} each
                        </div>
                        {c.special_instructions && (
                          <p className="text-[11px] text-amber-800 italic mt-0.5">
                            Note: {c.special_instructions}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                          <button
                            onClick={() => onUpdateQuantity(c.menu_item.id, c.quantity - 1)}
                            className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-900 tabular-nums">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(c.menu_item.id, c.quantity + 1)}
                            className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="w-16 text-right font-display font-bold text-xs text-neutral-900 tabular-nums">
                          ₱{(c.menu_item.price * c.quantity).toFixed(2)}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(c.menu_item.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Soup Feature */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-800 flex items-center justify-center shrink-0">
                    <Soup className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950">
                      Include Complimentary Hot Soup?
                    </div>
                    <div className="text-[11px] text-amber-800/80">
                      Free tamarind/beef savory soup packed separately with your order
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeSoup}
                    onChange={(e) => setFreeSoup(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                {/* Order Type Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Order Type (Pickup or Delivery)
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                        orderType === 'pickup'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pickup (Takeout)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                        orderType === 'delivery'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5 text-amber-600" />
                      <span>Delivery (+₱35)</span>
                    </button>
                  </div>
                </div>

                {/* Customer Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g., John Miller"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g., 0917-123-4567"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Delivery Address if Delivery Selected */}
                {orderType === 'delivery' && (
                  <div className="space-y-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Exact Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="House / Unit No., Street, Barangay / Neighborhood"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Landmark / Rider Directions
                      </label>
                      <input
                        type="text"
                        value={deliveryLandmark}
                        onChange={(e) => setDeliveryLandmark(e.target.value)}
                        placeholder="e.g., Opposite corner store, blue townhouse gate"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-neutral-900">
                        {orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash upon Pickup'}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Pay in cash when you receive the food
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gcash')}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        paymentMethod === 'gcash'
                          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-blue-900 flex items-center justify-between">
                        <span>GCash / Maya</span>
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Scan QR code or send to 0917...
                      </div>
                    </button>
                  </div>

                  {/* Cash Change Selector */}
                  {paymentMethod === 'cash' && (
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1.5">
                      <span className="font-semibold text-neutral-700">Need change from the kitchen cashier?</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCashChangeFor(null)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                            cashChangeFor === null
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          Exact Cash
                        </button>
                        {[200, 500, 1000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setCashChangeFor(amt)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border tabular-nums ${
                              cashChangeFor === amt
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                            }`}
                          >
                            Change for ₱{amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GCash QR & Ref Number Details */}
                  {paymentMethod === 'gcash' && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-blue-950">GCash / Maya Merchant Account</div>
                          <div className="text-[11px] text-blue-800">Maria Elena Santos (Aling Nena)</div>
                          <div className="font-mono font-bold text-blue-900 text-xs mt-0.5">
                            0917-823-4567
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowQrModal(!showQrModal)}
                          className="px-2.5 py-1.5 bg-blue-600 text-white font-semibold rounded-md text-[11px] hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View QR Code</span>
                        </button>
                      </div>

                      {/* Expandable simulated QR preview */}
                      {showQrModal && (
                        <div className="p-3 bg-white rounded-lg border border-blue-200 text-center space-y-2">
                          <div className="w-32 h-32 mx-auto bg-neutral-900 rounded-lg p-2 flex items-center justify-center text-white text-[10px] text-center font-mono">
                            <div className="space-y-1">
                              <QrCode className="w-16 h-16 mx-auto text-blue-400" />
                              <div className="text-[9px] text-neutral-300">GCASH INSTANT SCAN</div>
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            Scan with your GCash app or send express to <strong>0917-823-4567</strong>
                          </p>
                        </div>
                      )}

                      {/* Reference Number Field */}
                      <div>
                        <label className="block text-xs font-bold text-blue-950 mb-1">
                          GCash Reference Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={gcashRefNumber}
                          onChange={(e) => setGcashRefNumber(e.target.value)}
                          placeholder="e.g., GC-902819382"
                          className="w-full text-xs px-3 py-2 rounded-lg border border-blue-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      {/* Mock Receipt Upload */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setMockScreenshotAttached(!mockScreenshotAttached)}
                          className={`w-full py-2 px-3 border border-dashed rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
                            mockScreenshotAttached
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-blue-300 text-blue-800 hover:bg-blue-100/50'
                          }`}
                        >
                          {mockScreenshotAttached ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Receipt screenshot attached successfully!</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Attach payment screenshot (optional)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Cost Breakdown */}
                <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Viands & Items Subtotal:</span>
                    <span className="tabular-nums font-semibold text-neutral-900">₱{subtotal.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Rider Fee:</span>
                      <span className="tabular-nums font-semibold text-neutral-900">₱{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {freeSoup && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Complimentary Hot Broth:</span>
                      <span className="font-semibold uppercase">Included (₱0)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Amount Due:</span>
                    <span className="font-display text-lg text-amber-700 tabular-nums">
                      ₱{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Submitting Order...' : 'Confirm & Place Order'}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
