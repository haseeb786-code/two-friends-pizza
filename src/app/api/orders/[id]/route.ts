import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, payment_status } = body;

    let query = 'UPDATE orders SET updated_at = CURRENT_TIMESTAMP';
    const values: any[] = [];

    if (status) {
      query += ', status = ?';
      values.push(status);
    }

    if (payment_status) {
      query += ', payment_status = ?';
      values.push(payment_status);
    }

    query += ' WHERE id = ?';
    values.push(id);

    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = db.prepare('DELETE FROM orders WHERE id = ?').run(id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Order ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
