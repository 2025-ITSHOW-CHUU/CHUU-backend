import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/post.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class PostService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private configService: ConfigService,
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';
  }

  async fileUpload(file: Express.Multer.File): Promise<string> {
    try {
      const timestamp = Date.now();
      const key = `image/chuu/${timestamp}-${file.originalname}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await this.s3.upload(uploadParams).promise();
      return uploadResult.Location;
    } catch (error) {
      throw new Error(`File upload failed: ${error}`);
    }
  }

  async uploadPost(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const fileUrl = await this.fileUpload(file);
      const newPost = new this.postModel({
        ...createPostDto,
        imageUrl: fileUrl,
      });

      await newPost.save();

      return { success: true, message: 'Success to upload post' };
    } catch (error) {
      throw new Error(`Failed to upload post: ${error}`);
    }
  }
}
