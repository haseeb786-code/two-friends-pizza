import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { MENU_PRODUCTS } from '@/data/menu';
import { DEALS } from '@/data/deals';

export async function GET() {
  try {
    const overrides = db.prepare('SELECT * FROM product_overrides').all() as any[];
    const overrideMap = new Map<string, any>();
    overrides.forEach((o) => overrideMap.set(o.product_id, o));

    // Merge overrides with products
    const products = MENU_PRODUCTS.map((prod) => {
      const ov = overrideMap.get(prod.id);
      if (!ov) return prod;
      return {
        ...prod,
        name: ov.name || prod.name,
        description: ov.description || prod.description,
        basePrice: ov.base_price !== null ? ov.base_price : prod.basePrice,
        image: ov.image_url || prod.image,
        isAvailable: ov.is_available === 1,
        isFeatured: ov.is_featured === 1,
        badge: ov.badge || undefined
      };
    });

    // Merge overrides with deals
    const deals = DEALS.map((deal) => {
      const ov = overrideMap.get(deal.id);
      if (!ov) return deal;
      return {
        ...deal,
        name: ov.name || deal.name,
        description: ov.description || deal.description,
        price: ov.base_price !== null ? ov.base_price : deal.price,
        image: ov.image_url || deal.image,
        isFeatured: ov.is_featured === 1
      };
    });

    return NextResponse.json({
      success: true,
      products,
      deals,
      overrides
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      product_id,
      name,
      description,
      category,
      base_price,
      image_url,
      is_available = 1,
      is_featured = 0,
      badge = ''
    } = body;

    if (!product_id) {
      return NextResponse.json({ success: false, error: 'product_id is required' }, { status: 400 });
    }

    const upsert = db.prepare(`
      INSERT INTO product_overrides (
        product_id, name, description, category, base_price, image_url, is_available, is_featured, badge, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(product_id) DO UPDATE SET
        name = COALESCE(?, product_overrides.name),
        description = COALESCE(?, product_overrides.description),
        category = COALESCE(?, product_overrides.category),
        base_price = COALESCE(?, product_overrides.base_price),
        image_url = COALESCE(?, product_overrides.image_url),
        is_available = COALESCE(?, product_overrides.is_available),
        is_featured = COALESCE(?, product_overrides.is_featured),
        badge = COALESCE(?, product_overrides.badge),
        updated_at = CURRENT_TIMESTAMP
    `);

    upsert.run(
      product_id, name, description, category, base_price, image_url, is_available, is_featured, badge,
      name, description, category, base_price, image_url, is_available, is_featured, badge
    );

    const saved = db.prepare('SELECT * FROM product_overrides WHERE product_id = ?').get(product_id);

    return NextResponse.json({
      success: true,
      message: `Product ${product_id} updated successfully`,
      override: saved
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
