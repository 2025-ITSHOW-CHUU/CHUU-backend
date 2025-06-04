import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ImageService {
  async saveBase64Image(base64: string): Promise<string> {
    const buffer = Buffer.from(base64, 'base64');
    const filename = `${randomUUID()}.png`;
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    fs.writeFileSync(path.join(uploadPath, filename), buffer);
    return filename;
  }

  async getPrintableHtml(filename: string): Promise<string> {
    const imagePath = `/uploads/${filename}`;

    // 출력용 HTML 반환
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Image</title>
        <style>
          body { text-align: center; margin: 0; padding: 0; }
          img { width: 100%; margin-top: 10px; }
        </style>
      </head>
      <body onload="window.print()">
        <img src="${imagePath}" alt="Printable Image" />
      </body>
      </html>
    `;
  }
}
