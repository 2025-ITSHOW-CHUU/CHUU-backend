import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(
      '/etc/letsencrypt/live/chuu.mirim-it-show.site/privkey.pem',
    ),
    cert: fs.readFileSync(
      '/etc/letsencrypt/live/chuu.mirim-it-show.site/fullchain.pem',
    ),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(
    cors({
      origin: ['http://localhost:3001', 'https://chuu-frontend.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
