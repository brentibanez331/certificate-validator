// src/app/api/upload-certificates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fromPath } from 'pdf2pic';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { arrayBuffer } = await req.json();
        const tempFilePath = path.join(process.cwd(), 'temp.pdf');
        await fs.writeFile(tempFilePath, new Uint8Array(arrayBuffer));

        const pdf2pic = fromPath(tempFilePath, {
            density: 100,
            saveFilename: "certificateDesign",
            savePath: "./output",
            format: "png",
            width: 800,
            height: 600
        });

        const page1 = await pdf2pic(1);

        await fs.unlink(tempFilePath);

        return NextResponse.json({ path: page1.path });
    } catch (error) {
        console.error('Error handling file:', error);
        return NextResponse.error();
    }
}
