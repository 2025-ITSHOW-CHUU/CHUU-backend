import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
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
                    body { text-align: center; margin: 0; padding: 20px; background-color: #f9f9f9; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; }
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
                  };
                </script>
            </body>
            </html>
        `;
  }
}
