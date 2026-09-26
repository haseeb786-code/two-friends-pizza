import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, event_type, metadata = {} } = body;

    if (!session_id || !event_type) {
      return NextResponse.json({ success: false, error: 'Missing session_id or event_type' }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO funnel_events (session_id, event_type, metadata_json)
      VALUES (?, ?, ?)
    `).run(session_id, event_type, JSON.stringify(metadata));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
