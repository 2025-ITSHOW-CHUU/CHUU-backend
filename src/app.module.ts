import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { Mongoose } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home/home.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL || ''),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
  ],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
