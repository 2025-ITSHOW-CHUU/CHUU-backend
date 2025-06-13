import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/post.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PostGateway } from './post.gateway';

type PostType = {
  teacher: string;
  comment: string;
  image: string;
};

@Injectable()
export class PostService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private configService: ConfigService,
    private postGateway: PostGateway,
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
    this.bucketName =
      this.configService.get<string>('AWS_BUCKET_NAME') || 'it-show-nuto';
  }

  async uploadPost(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<{ success: boolean; message: string }> {
    if (files[0]) {
      try {
        const timestamp = Date.now();

        const key = `image/chuu/${timestamp}-${files[0].originalname}`;

        const uploadParams = {
          Bucket: this.bucketName,
          Key: key,
          Body: files[0].buffer,
          ContentType: files[0].mimetype,
        };

        const uploadResult = await this.s3.upload(uploadParams).promise();

        const fileUrl = uploadResult.Location;
        const newPost = new this.postModel({
          ...createPostDto,
          image: fileUrl,
        });

        await newPost.save();

        this.postGateway.sendNewPost(newPost);

        return { success: true, message: 'Success to upload post' };
      } catch (error) {
        throw new Error(`Failed to upload post: ${error}`);
      }
    } else {
      return { success: false, message: 'No file provided' };
    }
  }

  async getPost(): Promise<{
    success: boolean;
    message: string;
    data?: PostType[];
  }> {
    try {
      const posts = await this.postModel.find({}).sort({
        createdAt: -1,
      });

      console.log(posts);
      const formattedPosts: PostType[] = posts.map((post) => ({
        teacher: post.teacher,
        comment: post.comment,
        image: post.image || '',
      }));
      return {
        success: true,
        message: 'Success to get posts',
        data: formattedPosts,
      };
    } catch (error) {
      throw new Error(`Failed to get posts: ${error}`);
    }
  }
}
