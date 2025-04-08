import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostController } from './post.controller';
import { ConfigModule } from '@nestjs/config';
import { PostGateway } from './post.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ConfigModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostGateway],
  exports: [PostService],
})
export class PostModule {}
