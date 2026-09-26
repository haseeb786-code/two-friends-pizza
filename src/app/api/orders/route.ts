import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const range = searchParams.get('range');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (range) {
      if (range === 'today') {
        query += " AND date(created_at, 'localtime') = date('now', 'localtime')";
      } else if (range === 'yesterday') {
        query += " AND date(created_at, 'localtime') = date('now', '-1 day', 'localtime')";
      } else if (range === 'week') {
        query += " AND created_at >= datetime('now', '-7 days')";
      } else if (range === 'month') {
        query += " AND created_at >= datetime('now', '-30 days')";
      }
    }

    if (search) {
      query += ' AND (customer_name LIKE ? OR phone LIKE ? OR id LIKE ? OR sector LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const orders = db.prepare(query).all(...params);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      order_type = 'delivery',
      address = '',
      sector = 'Rawat',
      landmark = '',
      payment_method = 'cod',
      subtotal,
      delivery_fee = 0,
      discount = 0,
      total,
      notes = '',
      items = [],
      coupon_code = ''
    } = body;

    if (!customer_name || !phone || !total) {
      return NextResponse.json({ success: false, error: 'Missing required order fields' }, { status: 400 });
    }

    // Generate unique order ID: TF-[random 4 digits]
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    const nextNum = 1000 + orderCount.count + 1;
    const orderId = `TF-${nextNum}`;

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, customer_name, phone, order_type, address, sector, landmark,
        payment_method, payment_status, status, subtotal, delivery_fee, discount, total, notes, items_json
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, 'pending', 'pending', ?, ?, ?, ?, ?, ?
      )
    `);

    insertOrder.run(
      orderId,
      customer_name.trim(),
      phone.trim(),
      order_type,
      address.trim(),
      sector.trim(),
      landmark.trim(),
      payment_method,
      subtotal,
      delivery_fee,
      discount,
      total,
      notes.trim(),
      JSON.stringify(items)
    );

    // Upsert customer in CRM directory
    const existingCust = db.prepare('SELECT * FROM customers WHERE phone = ?').get(phone.trim()) as any;
    const itemsSummary = items.map((i: any) => i.name).filter(Boolean);

    if (existingCust) {
      let favs: string[] = [];
      try {
        favs = JSON.parse(existingCust.favorite_items_json || '[]');
      } catch (e) {}
      const updatedFavs = Array.from(new Set([...favs, ...itemsSummary]));

      db.prepare(`
        UPDATE customers
        SET total_orders = total_orders + 1,
            total_spent = total_spent + ?,
            last_order_at = CURRENT_TIMESTAMP,
            name = ?,
            address = COALESCE(NULLIF(?, ''), address),
            sector = COALESCE(NULLIF(?, ''), sector),
            landmark = COALESCE(NULLIF(?, ''), landmark),
            favorite_items_json = ?
        WHERE phone = ?
      `).run(total, customer_name.trim(), address.trim(), sector.trim(), landmark.trim(), JSON.stringify(updatedFavs), phone.trim());
    } else {
      db.prepare(`
        INSERT INTO customers (
          phone, name, address, sector, landmark, total_orders, total_spent, favorite_items_json
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
      `).run(phone.trim(), customer_name.trim(), address.trim(), sector.trim(), landmark.trim(), total, JSON.stringify(itemsSummary));
    }

    // Increment coupon used_count if coupon applied
    if (coupon_code) {
      db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?').run(coupon_code);
    }

    // Record funnel event: checkout_completed
    db.prepare(`
      INSERT INTO funnel_events (session_id, event_type, metadata_json)
      VALUES (?, 'checkout_completed', ?)
    `).run(`order_${orderId}`, JSON.stringify({ orderId, total, itemsCount: items.length }));

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created and persisted successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
