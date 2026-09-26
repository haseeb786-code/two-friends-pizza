import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const customers = db.prepare(`
      SELECT 
        id, phone, name, address, sector, landmark,
        total_orders, total_spent, first_order_at, last_order_at,
        favorite_items_json, notes,
        ROUND(CAST(total_spent AS FLOAT) / MAX(total_orders, 1)) as aov,
        CAST((julianday('now') - julianday(last_order_at)) AS INTEGER) as days_since_last_order
      FROM customers
      ORDER BY last_order_at DESC
    `).all() as any[];

    // Classify segments
    const classified = customers.map((c) => {
      let segment = 'New';
      if (c.total_orders >= 4) {
        segment = c.days_since_last_order > 30 ? 'VIP At Risk' : 'VIP Dosti Regular';
      } else if (c.total_orders >= 2) {
        segment = c.days_since_last_order > 35 ? 'At Risk' : 'Repeat Customer';
      } else if (c.days_since_last_order > 45) {
        segment = 'Dormant';
      }

      let favorites: string[] = [];
      try {
        favorites = JSON.parse(c.favorite_items_json || '[]');
      } catch (e) {}

      return {
        ...c,
        segment,
        favorites
      };
    });

    const stats = {
      totalCustomers: classified.length,
      repeatCustomers: classified.filter((c) => c.total_orders > 1).length,
      repeatRate: classified.length > 0 ? Math.round((classified.filter((c) => c.total_orders > 1).length / classified.length) * 100) : 0,
      atRiskCount: classified.filter((c) => c.segment.includes('Risk') || c.segment === 'Dormant').length,
    };

    return NextResponse.json({
      success: true,
      customers: classified,
      stats
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
