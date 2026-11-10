import { useMemo } from 'react';
import { Order } from '../types';
import { Download, Wallet, Banknote, ShoppingBag, TrendingUp } from 'lucide-react';

interface AdminSalesSummaryProps {
  orders: Order[];
}

export function AdminSalesSummary({ orders }: AdminSalesSummaryProps) {
  // Aggregate sales metrics
  const stats = useMemo(() => {
    // Only count non-cancelled orders for sales
    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const completedOrders = orders.filter((o) => o.status === 'completed');

    let totalSales = 0;
    let cashSales = 0;
    let ewalletSales = 0;
    const dishTally: Record<string, { name: string; count: number; revenue: number }> = {};

    validOrders.forEach((o) => {
      totalSales += o.total_amount;
      if (o.payment_method === 'cash') {
        cashSales += o.total_amount;
      } else {
        ewalletSales += o.total_amount;
      }

      o.items.forEach((item) => {
        if (!dishTally[item.menu_item_id]) {
          dishTally[item.menu_item_id] = { name: item.name, count: 0, revenue: 0 };
        }
        dishTally[item.menu_item_id].count += item.quantity;
        dishTally[item.menu_item_id].revenue += item.price * item.quantity;
      });
    });

    const topDishes = Object.values(dishTally).sort((a, b) => b.count - a.count);

    return {
      totalSales,
      cashSales,
      ewalletSales,
      totalOrdersCount: orders.length,
      validOrdersCount: validOrders.length,
      completedOrdersCount: completedOrders.length,
      topDishes,
    };
  }, [orders]);

  const handleDownloadCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Type', 'Payment Method', 'Payment Status', 'Total (PHP)', 'Status'];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString(),
      `"${o.customer_name}"`,
      o.customer_phone,
      o.order_type,
      o.payment_method,
      o.payment_status,
      o.total_amount.toFixed(2),
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kusina_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sales Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-lg text-neutral-900">
            Daily Sales & Revenue Report
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time breakdown of total revenue, cash in drawer, and digital payments via GCash / Maya.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sales Report (CSV)</span>
        </button>
      </div>

      {/* Primary KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Total Daily Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-neutral-900 tabular-nums">
            ₱{stats.totalSales.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Across <strong>{stats.validOrdersCount}</strong> active/fulfilled orders
          </div>
        </div>

        {/* Cash in Drawer */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Cash in Drawer / Hand</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-emerald-700 tabular-nums">
            ₱{stats.cashSales.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {stats.totalSales > 0 ? Math.round((stats.cashSales / stats.totalSales) * 100) : 0}% of daily total
          </div>
        </div>

        {/* GCash / Maya E-Wallet */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>GCash / Maya E-Wallet</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-blue-700 tabular-nums">
            ₱{stats.ewalletSales.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {stats.totalSales > 0 ? Math.round((stats.ewalletSales / stats.totalSales) * 100) : 0}% of daily total
          </div>
        </div>

        {/* Completed Orders Count */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Orders Fulfilled</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-purple-900 tabular-nums">
            {stats.completedOrdersCount} / {stats.totalOrdersCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length} orders currently in kitchen
          </div>
        </div>
      </div>

      {/* Grid: Best Selling Viands vs Recent Orders Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Selling Viands Ranking */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm text-neutral-900">
            Top Bestselling Dishes Today
          </h3>

          {stats.topDishes.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No sales data recorded yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {stats.topDishes.slice(0, 5).map((dish, idx) => (
                <div key={dish.name} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 font-mono text-neutral-400 font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-neutral-900">{dish.name}</div>
                      <div className="text-[11px] text-neutral-500">
                        {dish.count} {dish.count === 1 ? 'portion' : 'portions'} sold
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-neutral-800 tabular-nums">
                    ₱{dish.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Ledger */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-neutral-900">
              Transactions & Orders Ledger
            </h3>
            <span className="text-xs text-neutral-500">{orders.length} total orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">Order No</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-sans">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/70">
                    <td className="px-4 py-2.5 font-mono font-bold text-neutral-900">
                      {o.order_number}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-neutral-900">
                      {o.customer_name}
                    </td>
                    <td className="px-4 py-2.5 capitalize">
                      {o.order_type}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="uppercase font-semibold text-neutral-800">{o.payment_method}</span>
                      {o.gcash_ref_number && (
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {o.gcash_ref_number}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold tabular-nums text-neutral-900">
                      ₱{o.total_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          o.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : o.status === 'preparing'
                            ? 'bg-blue-100 text-blue-900'
                            : o.status === 'ready'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
