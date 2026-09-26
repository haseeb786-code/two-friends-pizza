import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'pizza.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// ── Database Initialization ──────────────────────────────────────────────
export function initDb() {
  // 1. Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      order_type TEXT NOT NULL DEFAULT 'delivery',
      address TEXT,
      sector TEXT,
      landmark TEXT,
      payment_method TEXT NOT NULL DEFAULT 'cod',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      status TEXT NOT NULL DEFAULT 'pending',
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL DEFAULT 0,
      discount INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      notes TEXT,
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      address TEXT,
      sector TEXT,
      landmark TEXT,
      total_orders INTEGER DEFAULT 0,
      total_spent INTEGER DEFAULT 0,
      first_order_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_order_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      favorite_items_json TEXT,
      notes TEXT
    );
  `);

  // 3. Product Overrides table (allows owner to toggle out-of-stock, change price, badges, images)
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_overrides (
      product_id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      category TEXT,
      base_price INTEGER,
      sizes_json TEXT,
      image_url TEXT,
      is_available INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      badge TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Conversion Funnel Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS funnel_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      metadata_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Marketing Coupons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL DEFAULT 'fixed',
      discount_value INTEGER NOT NULL,
      min_order INTEGER NOT NULL DEFAULT 1000,
      is_active INTEGER DEFAULT 1,
      used_count INTEGER DEFAULT 0,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Admin Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default coupons if not existing
  const existingCoupon = db.prepare('SELECT COUNT(*) as count FROM coupons').get() as { count: number };
  if (existingCoupon.count === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order, is_active, expires_at)
      VALUES (?, ?, ?, ?, 1, ?)
    `);
    insertCoupon.run('DOSTI100', 'fixed', 100, 1000, '2026-12-31 23:59:59');
    insertCoupon.run('RAWAT15', 'percentage', 15, 1500, '2026-12-31 23:59:59');
  }

  // Seed initial realistic order data if fresh database to populate charts
  const existingOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (existingOrders.count === 0) {
    seedInitialOrders();
  }
}

/** Seed realistic historical and active orders for Rawat so analytics work immediately */
function seedInitialOrders() {
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, customer_name, phone, order_type, address, sector, landmark,
      payment_method, payment_status, status, subtotal, delivery_fee, discount, total, notes, items_json, created_at
    ) VALUES (
      @id, @customer_name, @phone, @order_type, @address, @sector, @landmark,
      @payment_method, @payment_status, @status, @subtotal, @delivery_fee, @discount, @total, @notes, @items_json, @created_at
    )
  `);

  const insertCustomer = db.prepare(`
    INSERT OR REPLACE INTO customers (
      phone, name, address, sector, landmark, total_orders, total_spent, first_order_at, last_order_at, favorite_items_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleOrders = [
    {
      id: 'TF-1001',
      customer_name: 'Usman Tariq',
      phone: '0333-5129482',
      order_type: 'delivery',
      address: 'Street 4, Near Jamia Masjid',
      sector: 'Chota Mera',
      landmark: 'Green gate opposite grocery store',
      payment_method: 'cod',
      payment_status: 'paid',
      status: 'completed',
      subtotal: 1700,
      delivery_fee: 0,
      discount: 0,
      total: 1700,
      notes: 'Make it extra spicy with extra ketchup',
      items_json: JSON.stringify([
        { name: 'Crown Crust Pizza', size: 'Large', quantity: 1, price: 1700 }
      ]),
      created_at: new Date(Date.now() - 3600000 * 26).toISOString()
    },
    {
      id: 'TF-1002',
      customer_name: 'Hamza Abbasi',
      phone: '0300-8491024',
      order_type: 'delivery',
      address: 'Chak Belli Road Plaza 2nd Floor',
      sector: 'Main Chak Belli Road',
      landmark: 'Near Afridi Market',
      payment_method: 'jazzcash',
      payment_status: 'paid',
      status: 'completed',
      subtotal: 2450,
      delivery_fee: 0,
      discount: 100,
      total: 2350,
      notes: 'Call before delivery',
      items_json: JSON.stringify([
        { name: 'Crown Crust Pizza', size: 'Medium', quantity: 1, price: 1150 },
        { name: 'Pizza Burger', size: 'Standard', quantity: 1, price: 800 },
        { name: 'Regular Fries', size: 'Standard', quantity: 2, price: 500 }
      ]),
      created_at: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
      id: 'TF-1003',
      customer_name: 'Ali Raza',
      phone: '0345-9821451',
      order_type: 'takeaway',
      address: '',
      sector: 'Rawat Bazaar',
      landmark: 'Picking up at counter',
      payment_method: 'cod',
      payment_status: 'paid',
      status: 'completed',
      subtotal: 1260,
      delivery_fee: 0,
      discount: 0,
      total: 1260,
      notes: 'Will pick up in 20 minutes',
      items_json: JSON.stringify([
        { name: 'Deal A1', size: 'Combo', quantity: 2, price: 1260 }
      ]),
      created_at: new Date(Date.now() - 3600000 * 14).toISOString()
    },
    {
      id: 'TF-1004',
      customer_name: 'Dr. Zeeshan',
      phone: '0312-5559821',
      order_type: 'delivery',
      address: 'Clinic Complex, GT Road Junction',
      sector: 'Rawat City',
      landmark: 'Near Shell Pump',
      payment_method: 'easypaisa',
      payment_status: 'paid',
      status: 'out_for_delivery',
      subtotal: 1850,
      delivery_fee: 100,
      discount: 0,
      total: 1950,
      notes: 'Deliver to reception',
      items_json: JSON.stringify([
        { name: 'Chicken Fajita', size: 'Large', quantity: 1, price: 1500 },
        { name: 'Zinger Burger', size: 'Standard', quantity: 1, price: 350 }
      ]),
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'TF-1005',
      customer_name: 'Bilal Khan',
      phone: '0331-0498112',
      order_type: 'delivery',
      address: 'House 12B, Chota Mera Extension',
      sector: 'Chota Mera',
      landmark: 'Near Water Tank',
      payment_method: 'cod',
      payment_status: 'pending',
      status: 'preparing',
      subtotal: 1950,
      delivery_fee: 0,
      discount: 0,
      total: 1950,
      notes: 'Please send hot garlic dip',
      items_json: JSON.stringify([
        { name: 'Crown Crust Pizza', size: 'XL', quantity: 1, price: 1950 }
      ]),
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'TF-1006',
      customer_name: 'Shahid Mehmood',
      phone: '0321-4478129',
      order_type: 'delivery',
      address: 'Main Gate, DHA Phase 4 Ext',
      sector: 'DHA Phase 4/5 Extension',
      landmark: 'Security Gate Checkpoint',
      payment_method: 'cod',
      payment_status: 'pending',
      status: 'pending',
      subtotal: 1600,
      delivery_fee: 100,
      discount: 0,
      total: 1700,
      notes: 'Ring bell or call on arrival',
      items_json: JSON.stringify([
        { name: 'Pizza Burger', size: 'Standard', quantity: 2, price: 1600 }
      ]),
      created_at: new Date(Date.now() - 600000).toISOString()
    }
  ];

  for (const o of sampleOrders) {
    insertOrder.run(o);
  }

  // Populate initial customers
  insertCustomer.run('0333-5129482', 'Usman Tariq', 'Street 4, Near Jamia Masjid', 'Chota Mera', 'Green gate', 3, 5100, '2026-08-15', '2026-09-25', JSON.stringify(['Crown Crust Pizza']));
  insertCustomer.run('0300-8491024', 'Hamza Abbasi', 'Chak Belli Road Plaza', 'Main Chak Belli Road', 'Near Afridi Market', 4, 9400, '2026-08-10', '2026-09-25', JSON.stringify(['Pizza Burger', 'Crown Crust Pizza']));
  insertCustomer.run('0345-9821451', 'Ali Raza', 'Rawat Bazaar', 'Rawat Bazaar', 'Counter pickup', 2, 2520, '2026-09-01', '2026-09-25', JSON.stringify(['Deal A1']));
  insertCustomer.run('0312-5559821', 'Dr. Zeeshan', 'Clinic Complex', 'Rawat City', 'Near Shell Pump', 1, 1950, '2026-09-26', '2026-09-26', JSON.stringify(['Chicken Fajita']));
  insertCustomer.run('0331-0498112', 'Bilal Khan', 'House 12B', 'Chota Mera', 'Near Water Tank', 5, 9750, '2026-07-20', '2026-09-26', JSON.stringify(['Crown Crust Pizza']));
  insertCustomer.run('0321-4478129', 'Shahid Mehmood', 'DHA Phase 4 Ext', 'DHA Phase 4/5 Extension', 'Gate Checkpoint', 1, 1700, '2026-09-26', '2026-09-26', JSON.stringify(['Pizza Burger']));

  // Seed funnel events for analytics
  const insertEvent = db.prepare('INSERT INTO funnel_events (session_id, event_type, metadata_json, created_at) VALUES (?, ?, ?, ?)');
  const now = Date.now();
  for (let i = 0; i < 350; i++) {
    const time = new Date(now - Math.random() * 86400000 * 7).toISOString();
    insertEvent.run(`sess_${i}`, 'visitor', '{}', time);
    if (i < 260) insertEvent.run(`sess_${i}`, 'menu_view', '{}', time);
    if (i < 170) insertEvent.run(`sess_${i}`, 'product_view', JSON.stringify({ item: 'Crown Crust Pizza' }), time);
    if (i < 95) insertEvent.run(`sess_${i}`, 'add_to_cart', JSON.stringify({ total: 1700 }), time);
    if (i < 65) insertEvent.run(`sess_${i}`, 'checkout_initiated', '{}', time);
    if (i < 42) insertEvent.run(`sess_${i}`, 'checkout_completed', '{}', time);
  }
}

// Auto-initialize DB on import
initDb();

export default db;
