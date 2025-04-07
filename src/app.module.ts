import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { HomeModule } from './home/home.module';
import { Mongoose } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users/users.controller';
import { HomeController } from './home/home.controller';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:591006@localhost:27017/chuu?authSource=admin',
    ),
    UserModule,
    HomeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PostModule,
  ],
  controllers: [AppController, HomeController, UserController, PostController],
  providers: [AppService],
})
export class AppModule {}
