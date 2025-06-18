import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'naver',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async getPrintableHtmlFromBase64(base64: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const imageSrc = base64.startsWith('data:image')
      ? base64
      : `data:image/png;base64,${base64}`;

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Image</title>
                <style>
                    body { text-align: center; margin: 0; padding: 20px; background-color: #f9f9f9; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; height: 100vh; }
                    img { width: 100%; filter: grayscale(100%) invert(0); position: absoulte; }
                </style>
            </head>
            <body onload="window.print()">  
                <img src="${imageSrc}" alt="Printable Image" />
                <script>
                  window.onload = () => {
                    setTimeout(() => {
                      window.print();
                    }, 500); // 이미지 로딩 여유시간

                    window.onafterprint = () => {
                      window.close(); // 인쇄 후 자동 닫기
                    };
                  };
                </script>
            </body>
            </html>
        `;
  }
  async sendImageEmail(to: string, file: Express.Multer.File) {
    const imageBuffer = file.buffer;

    await this.transporter.sendMail({
      from: `"Chuu" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: 'Chuu 네컷 사진 도착! 💋🩵',
      html: `
        <div style="font-family: 'Arial'; line-height: 1.6">
          <h2>📸 Chuu 네컷 사진 도착!</h2>
          <p>Chuu에 참여해 주셔서 감사합니다! 남은 아이티쇼도 즐겁게 관람해 주세요!!</p>
          <img src="cid:chuu4cut" alt="Chuu 네컷 사진" style="max-width: 100%; height: auto;"/>
          <p>늘 응원해요. 힘내요 우리! 🫶</p>
        </div>
      `,
      attachments: [
        {
          filename: 'chuu-4cut.png',
          content: imageBuffer,
          cid: 'chuu4cut',
        },
      ],
    });
  }
}
