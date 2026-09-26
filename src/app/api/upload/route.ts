import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/images
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanId = (productId || 'custom').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanId}-${Date.now()}${ext}`;
    const filePath = path.join(imagesDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      message: 'Image uploaded and saved successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
