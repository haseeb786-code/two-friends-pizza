import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, code, subtotal, discount_type, discount_value, min_order, expires_at } = body;

    // 1. Validation mode from customer checkout
    if (action === 'validate') {
      if (!code) {
        return NextResponse.json({ success: false, error: 'Promo code is required' }, { status: 400 });
      }

      const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(code.trim()) as any;

      if (!coupon) {
        return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 404 });
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
      }

      if (subtotal < coupon.min_order) {
        return NextResponse.json({
          success: false,
          error: `Minimum order for this coupon is ₨${coupon.min_order.toLocaleString()}`
        }, { status: 400 });
      }

      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
      } else {
        discountAmount = coupon.discount_value;
      }

      return NextResponse.json({
        success: true,
        coupon: {
          code: coupon.code,
          discountAmount,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value
        }
      });
    }

    // 2. Creation mode from Admin
    if (!code || !discount_value) {
      return NextResponse.json({ success: false, error: 'Code and discount value required' }, { status: 400 });
    }

    const insert = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order, expires_at, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    insert.run(
      code.trim().toUpperCase(),
      discount_type || 'fixed',
      discount_value,
      min_order || 1000,
      expires_at || null
    );

    return NextResponse.json({
      success: true,
      message: `Coupon ${code.toUpperCase()} created successfully`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
