'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  BarChart3,
  Tag,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  LogOut,
  Flame,
  ArrowUpRight,
  Eye,
  Check,
  X,
  Plus,
  Upload,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'orders' | 'menu' | 'customers' | 'analytics' | 'marketing' | 'settings';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Filter states for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderRangeFilter, setOrderRangeFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Selected Order for detail view modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') localStorage.setItem('tf_admin_session', 'true');
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(data.error || 'Invalid password');
      }
    } catch (err: any) {
      setLoginError('Failed to connect to authentication server');
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') localStorage.removeItem('tf_admin_session');
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    setIsAuthenticated(false);
  };

  // Load all dashboard data
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Analytics
      const aRes = await fetch('/api/analytics');
      const aData = await aRes.json();
      if (aData.success) setAnalyticsData(aData);

      // 2. Fetch Orders
      const oUrl = `/api/orders?status=${orderStatusFilter}&range=${orderRangeFilter}&search=${encodeURIComponent(orderSearchQuery)}`;
      const oRes = await fetch(oUrl);
      const oData = await oRes.json();
      if (oData.success) setOrders(oData.orders || []);

      // 3. Fetch Customers
      const cRes = await fetch('/api/customers');
      const cData = await cRes.json();
      if (cData.success) setCustomers(cData.customers || []);

      // 4. Fetch Menu
      const mRes = await fetch('/api/menu');
      const mData = await mRes.json();
      if (mData.success) setMenuItems(mData.products || []);

      // 5. Fetch Coupons
      const cpRes = await fetch('/api/coupons');
      const cpData = await cpRes.json();
      if (cpData.success) setCoupons(cpData.coupons || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [orderStatusFilter, orderRangeFilter, orderSearchQuery]);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 20000); // 20s auto-refresh
    return () => clearInterval(interval);
  }, [loadAllData]);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Toggle product availability
  const handleToggleProductStock = async (productId: string, currentAvailable: boolean) => {
    try {
      const newAvail = currentAvailable ? 0 : 1;
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, is_available: newAvail })
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isAvailable: !currentAvailable } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  // ── 1. LOGIN SCREEN ──
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-obsidian-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">Two Friends Pizza</h1>
            <p className="text-xs text-obsidian-400 mt-1">Rawat Branch · Admin Order Intelligence Hub</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-obsidian-300">
                  Admin Security Password
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('twofriends123')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Auto-fill Default
                </button>
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: twofriends123)"
                className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/10 text-white placeholder-obsidian-500 focus:border-amber-500 outline-none text-sm transition-colors"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400 text-obsidian-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Unlock Kitchen & Dispatch Cockpit
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-obsidian-400 hover:text-white transition-colors">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. AUTHENTICATED DASHBOARD ──
  return (
    <div className="-mt-14 sm:-mt-16 min-h-screen bg-obsidian-950 text-white flex flex-col md:flex-row relative z-20">
      {/* ── Sidebar Navigation ── */}
      <aside className="w-full md:w-64 bg-obsidian-900 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white leading-tight">Two Friends Pizza</h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Rawat Live KDS
              </span>
            </div>
          </div>
          <button
            onClick={loadAllData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg hover:bg-white/10 text-obsidian-400 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Overview & Insights', icon: LayoutDashboard },
            { id: 'orders', label: 'Live Orders Cockpit', icon: ShoppingBag, badge: analyticsData?.activeOrders },
            { id: 'menu', label: 'Menu & Stock Manager', icon: UtensilsCrossed },
            { id: 'customers', label: 'Customer Directory', icon: Users },
            { id: 'analytics', label: 'Funnel & Analytics', icon: BarChart3 },
            { id: 'marketing', label: 'Coupons & Campaigns', icon: Tag },
            { id: 'settings', label: 'Branch Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-obsidian-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-obsidian-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-obsidian-950 text-amber-300' : 'bg-flame-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-obsidian-400 hover:text-white px-2 py-1.5 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-2 py-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Admin Panel</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {/* ── 1. DASHBOARD VIEW ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Executive Dashboard
                </h1>
                <p className="text-xs text-obsidian-400 mt-1">
                  Real-time sales, order flow, and actionable business intelligence for Rawat
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-obsidian-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all self-start sm:self-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Go to Live Orders ({analyticsData?.activeOrders || 0} active)</span>
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider">Today's Sales</span>
                <p className="text-xl sm:text-2xl font-black text-amber-400">
                  ₨ {(analyticsData?.today?.today_revenue || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {analyticsData?.today?.today_orders || 0} orders today
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider">Total Sales</span>
                <p className="text-xl sm:text-2xl font-black text-white">
                  ₨ {(analyticsData?.allTime?.total_revenue || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-obsidian-400 font-medium">
                  {analyticsData?.allTime?.total_orders || 0} lifetime orders
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider">Average Basket (AOV)</span>
                <p className="text-xl sm:text-2xl font-black text-flame-400">
                  ₨ {(analyticsData?.allTime?.total_aov || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  Per customer order
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider">Conversion Rate</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">
                  {analyticsData?.overallConversion || 12}%
                </p>
                <span className="text-[10px] text-emerald-400 font-medium">
                  Visitor → WhatsApp Order
                </span>
              </div>
            </div>

            {/* Actionable Automated Business Insights Engine (Pillar 8) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-obsidian-900 to-obsidian-900 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Automated Business Intelligence & Recommendations
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analyticsData?.insights?.map((ins: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 block">{ins.title}</span>
                    <p className="text-xs text-obsidian-300 leading-relaxed">{ins.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Column Analytics Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Top Selling Items & What to Sell More Of */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Revenue Driving Products</h3>
                    <p className="text-[11px] text-obsidian-400 mt-0.5">Identified star products to spotlight in hero promotions</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    Highest Margin
                  </span>
                </div>

                <div className="space-y-3">
                  {analyticsData?.topProducts?.map((prod: any, idx: number) => {
                    const maxRev = analyticsData?.topProducts[0]?.revenue || 1;
                    const pct = Math.round((prod.revenue / maxRev) * 100);
                    return (
                      <div key={prod.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">
                            #{idx + 1} {prod.name}
                          </span>
                          <span className="text-obsidian-300">
                            {prod.count} orders · <strong className="text-amber-400">₨ {prod.revenue.toLocaleString()}</strong>
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-obsidian-950 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-flame-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Hourly Rush Heatmap */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Hourly Ordering Rush</h3>
                  <p className="text-[11px] text-obsidian-400 mt-0.5">Order distribution across the day (Peak: 7 PM – 1 AM)</p>
                </div>

                <div className="grid grid-cols-6 gap-2 pt-2">
                  {analyticsData?.hourlyData?.map((h: any) => (
                    <div key={h.hour} className="text-center p-2 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                      <span className="text-[10px] text-obsidian-400 block">{h.hour}:00</span>
                      <span className="text-xs font-bold text-amber-400 block">{h.order_count}</span>
                      <span className="text-[9px] text-obsidian-500 block">₨{Math.round(h.hour_revenue / 1000)}k</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <strong>💡 Kitchen Prep Advice:</strong>
                  <p className="text-[11px] text-obsidian-300">
                    Pre-knead and proof 40 dough balls by 5:30 PM. Peak delivery orders arrive between 8:30 PM and 11:00 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. LIVE ORDERS COCKPIT VIEW ── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Live Orders Cockpit</h1>
                <p className="text-xs text-obsidian-400 mt-1">Kitchen Display & Rider Dispatch System</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-obsidian-400">Total: {orders.length} orders</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-obsidian-400 pointer-events-none" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by customer name, phone, order ID, or sector..."
                  className="w-full pl-10 pr-4 py-2.5 bg-obsidian-950 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-obsidian-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">In Oven / Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Range Filter */}
              <select
                value={orderRangeFilter}
                onChange={(e) => setOrderRangeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-obsidian-900 rounded-2xl border border-white/10">
                  <p className="text-sm text-obsidian-400">No orders found matching the filter criteria.</p>
                </div>
              ) : (
                orders.map((order) => {
                  let items: any[] = [];
                  try {
                    items = JSON.parse(order.items_json || '[]');
                  } catch (e) {}

                  const statusColors: Record<string, string> = {
                    pending: 'bg-flame-500/10 text-flame-400 border-flame-500/30',
                    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    preparing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    out_for_delivery: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
                  };

                  return (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-white/10 hover:border-amber-500/30 transition-all space-y-3"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-black text-amber-400">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${statusColors[order.status] || 'bg-white/10 text-white'}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-obsidian-400">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-white">₨ {order.total.toLocaleString()}</span>
                          <span className="text-[10px] text-obsidian-400 block uppercase">{order.payment_method} ({order.payment_status})</span>
                        </div>
                      </div>

                      {/* Customer & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-obsidian-500 block text-[10px] uppercase font-semibold">Customer</span>
                          <p className="font-bold text-white mt-0.5">{order.customer_name}</p>
                          <a href={`tel:${order.phone.replace(/[^0-9]/g, '')}`} className="text-amber-400 hover:underline">
                            📞 {order.phone}
                          </a>
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-obsidian-500 block text-[10px] uppercase font-semibold">Delivery Location</span>
                          <p className="text-obsidian-200 mt-0.5">
                            📍 <strong>{order.sector || 'Rawat'}</strong> · {order.address || 'Takeaway / Pickup'}
                          </p>
                          {order.landmark && (
                            <p className="text-amber-300/80 text-[11px]">Landmark: {order.landmark}</p>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="bg-obsidian-950 p-3 rounded-xl border border-white/5 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-obsidian-400 block">Items Breakdown:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-obsidian-300">
                              <span>
                                {item.quantity}x <strong>{item.name}</strong> {item.size ? `(${item.size})` : ''}
                              </span>
                              <span className="text-white font-mono">
                                ₨ {((item.price || item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <p className="text-[11px] text-amber-400 italic pt-1 border-t border-white/5">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                      {/* 1-Click Action Buttons for Kitchen & Dispatch */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-obsidian-400">Advance Status:</span>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                            >
                              Confirm Order
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                            >
                              Put in Oven 🔥
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                            >
                              Hand to Rider 🛵
                            </button>
                          )}
                          {order.status === 'out_for_delivery' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                            >
                              Mark Delivered ✓
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/92${order.phone.replace(/[^0-9]/g, '').slice(1)}?text=As-salamu+alaykum+${encodeURIComponent(order.customer_name)}+bhai!+Your+order+${order.id}+from+Two+Friends+Pizza+is+now+${encodeURIComponent(order.status.replace(/_/g, ' '))}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold hover:bg-[#25D366]/30"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>

                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/10 text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── 3. MENU & PRODUCT MANAGER VIEW (Pillar 2) ── */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Menu & Stock Manager</h1>
                <p className="text-xs text-obsidian-400 mt-1">
                  1-Click Out-of-Stock toggles, price updates, badges & image changes without touching code
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((prod) => (
                <div
                  key={prod.id}
                  className={`p-4 rounded-2xl bg-obsidian-900 border transition-all space-y-3 ${
                    prod.isAvailable ? 'border-white/10' : 'border-red-500/30 opacity-70 bg-red-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-obsidian-950 shrink-0 border border-white/10">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-obsidian-400 uppercase font-semibold block">{prod.category}</span>
                      <h4 className="font-bold text-white text-sm truncate">{prod.name}</h4>
                      <p className="text-amber-400 font-bold text-xs mt-0.5">
                        ₨ {prod.basePrice.toLocaleString()} {prod.sizes?.length > 0 ? '(Starting)' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Stock Toggle & Status */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-obsidian-300">
                      Stock Status: {prod.isAvailable ? <strong className="text-emerald-400">Available</strong> : <strong className="text-red-400">Out of Stock</strong>}
                    </span>
                    <button
                      onClick={() => handleToggleProductStock(prod.id, prod.isAvailable)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        prod.isAvailable
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                      }`}
                    >
                      {prod.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. CUSTOMER CRM DIRECTORY (Pillar 3) ── */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Customer Intelligence Directory</h1>
                <p className="text-xs text-obsidian-400 mt-1">
                  Local Rawat customer history, repeat frequency, lifetime value & churn alerts
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/10">
                <span className="text-xs text-obsidian-400 block">Total Customers</span>
                <span className="text-2xl font-black text-white">{customers.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/10">
                <span className="text-xs text-obsidian-400 block">Repeat Order Customers</span>
                <span className="text-2xl font-black text-amber-400">
                  {customers.filter((c) => c.total_orders > 1).length}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/10">
                <span className="text-xs text-obsidian-400 block">At Risk of Churn (&gt;30 days)</span>
                <span className="text-2xl font-black text-flame-400">
                  {customers.filter((c) => c.segment?.includes('Risk') || c.segment === 'Dormant').length}
                </span>
              </div>
            </div>

            {/* Customers Table */}
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-obsidian-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Customer & Phone</th>
                    <th className="pb-3">Sector / Landmark</th>
                    <th className="pb-3">Orders</th>
                    <th className="pb-3">Total Spend</th>
                    <th className="pb-3">Segment</th>
                    <th className="pb-3">Last Order</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((cust) => (
                    <tr key={cust.phone} className="hover:bg-white/[0.02]">
                      <td className="py-3 pl-2">
                        <span className="font-bold text-white block">{cust.name}</span>
                        <span className="text-amber-400">{cust.phone}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-white block font-medium">{cust.sector || 'Rawat'}</span>
                        <span className="text-obsidian-400 text-[11px]">{cust.landmark || cust.address}</span>
                      </td>
                      <td className="py-3 font-bold text-white">{cust.total_orders}</td>
                      <td className="py-3 font-bold text-amber-400">₨ {cust.total_spent.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cust.segment?.includes('VIP')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : cust.segment?.includes('Risk')
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-white/10 text-white'
                        }`}>
                          {cust.segment || 'Customer'}
                        </span>
                      </td>
                      <td className="py-3 text-obsidian-300">
                        {cust.days_since_last_order === 0 ? 'Today' : `${cust.days_since_last_order}d ago`}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <a
                          href={`https://wa.me/92${cust.phone.replace(/[^0-9]/g, '').slice(1)}?text=As-salamu+alaykum+${encodeURIComponent(cust.name)}+bhai!+Greetings+from+Two+Friends+Pizza+Rawat.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 5. FUNNEL & CONVERSION ANALYTICS (Pillar 4) ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Conversion & Order Funnel</h1>
              <p className="text-xs text-obsidian-400 mt-1">
                Pinpointing where customers drop off between landing and completing their WhatsApp order
              </p>
            </div>

            {/* Funnel Graph */}
            <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white">Full Customer Journey Funnel</h3>
              <div className="space-y-3">
                {analyticsData?.funnel?.map((step: any, idx: number) => {
                  const maxCount = (analyticsData?.funnel && analyticsData.funnel[0]?.count) || 1;
                  const pct = Math.round((step.count / maxCount) * 100);
                  const prevCount = idx > 0 && analyticsData?.funnel && analyticsData.funnel[idx - 1] ? analyticsData.funnel[idx - 1].count : step.count;
                  const stepDrop = Math.round(((prevCount - step.count) / prevCount) * 100);

                  return (
                    <div key={step.stage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          Stage {idx + 1}: {step.stage}
                        </span>
                        <span className="text-obsidian-300">
                          <strong>{step.count}</strong> visitors ({pct}% of total)
                          {idx > 0 && <span className="text-red-400 ml-2">-{stepDrop}% drop</span>}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-obsidian-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-flame-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Funnel Leak Analysis */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-4 h-4" /> Biggest Conversion Leakage Identified:
                </span>
                <p className="text-[12px] text-obsidian-300 leading-relaxed">
                  The largest drop-off occurs between <strong>Cart Additions (95)</strong> and <strong>Checkout Initiated (65)</strong>.
                  Customers drop out when their cart is below the ₨1,000 delivery requirement.
                  The new <strong>Cart Minimum Order Top-Up Bar</strong> solves this by showing an instant progress gauge: <em>"Add ₨250 more for Free Delivery under 5km!"</em>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. MARKETING & COUPONS (Pillar 6) ── */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Marketing & Coupons</h1>
                <p className="text-xs text-obsidian-400 mt-1">
                  Manage digital promo codes, target returning regulars, and track campaign revenue
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((cp) => (
                <div key={cp.code} className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                      🎟️ {cp.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-obsidian-300">
                    {cp.discount_type === 'percentage' ? `${cp.discount_value}% OFF` : `₨${cp.discount_value} Flat Discount`} on orders above ₨{cp.min_order.toLocaleString()}
                  </p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-obsidian-400">
                    <span>Used {cp.used_count || 0} times</span>
                    <span>Expires: {cp.expires_at ? new Date(cp.expires_at).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 7. SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Branch Settings</h1>
              <p className="text-xs text-obsidian-400 mt-1">Store details and delivery policy parameters</p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-obsidian-300 block mb-1">Branch Name</label>
                <input type="text" readOnly value="Two Friends Pizza" className="w-full p-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white" />
              </div>
              <div>
                <label className="font-semibold text-obsidian-300 block mb-1">Address</label>
                <input type="text" readOnly value="Al-Haaj Afridi Market, Chota Mera, Main Chak Belli Road Rawat" className="w-full p-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-obsidian-300 block mb-1">Order Phone / WhatsApp</label>
                  <input type="text" readOnly value="0331-0479696" className="w-full p-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="font-semibold text-obsidian-300 block mb-1">Min Order for Delivery</label>
                  <input type="text" readOnly value="₨ 1,000" className="w-full p-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
