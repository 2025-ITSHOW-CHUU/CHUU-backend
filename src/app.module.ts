import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { Mongoose } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:591006@localhost:27017/chuu?authSource=admin',
    ),
    UserModule, // 예시로 UserModule을 추가한 것입니다.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
