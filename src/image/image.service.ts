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
  async sendImageEmail(to: string, file: Express.Multer.File, type: string) {
    const imageBuffer = file.buffer;

    if (type === 'fourcut') {
      await this.transporter.sendMail({
        from: `"Chuu" <${this.configService.get('EMAIL_USER')}>`,
        to,
        subject: '📸 Chuu 네컷 사진이 도착했어요! 💋🩵',
        html: `
        <div style="font-family: 'Arial'; line-height: 1.6;">
          <h2>📸 Chuu 네컷 사진이 도착했어요!</h2>
          <p>2025 미림 IT Show에 참여해주셔서 진심으로 감사합니다.</p>
          <p>소중한 추억이 담긴 네컷 사진을 보내드려요!</p>
          <p>남은 시간도 IT Show에서 즐거운 경험 되시길 바랍니다 😊</p>
          <img src="cid:chuu4cut" alt="Chuu 네컷 사진" style="max-width: 100%; height: auto;"/>
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
    } else {
      await this.transporter.sendMail({
        from: `"Chuu" <${this.configService.get('EMAIL_USER')}>`,
        to,
        subject: '📸 Chuu 선생님과의 사진이 도착했어요! 💋🩵',
        html: `
        <div style="font-family: 'Arial'; line-height: 1.6;">
          <h2>📸 Chuu 선생님과의  사진이 도착했어요!</h2>
          <p>2025 미림 IT Show에 참여해주셔서 진심으로 감사합니다.</p>
          <p>소중한 추억이 담긴 선생님과의 사진을 보내드려요!</p>
          <p>남은 시간도 IT Show에서 즐거운 경험 되시길 바랍니다 😊</p>
          <img src="cid:chuu4cut" alt="Chuu 선생님과의 사진" style="max-width: 100%; height: auto;"/>
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
}
