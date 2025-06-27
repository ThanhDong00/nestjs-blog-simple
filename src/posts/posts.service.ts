import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from 'src/users/models/user.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,
  ) {}

  async create(createPostDto: CreatePostDto, id: number): Promise<Post> {
    try {
      return await this.postModel.create({
        ...createPostDto,
        userId: id,
      } as Post);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Post> {
    try {
      const post = await this.postModel.findOne({
        where: { id },
        include: [{ model: User, attributes: ['id', 'name'] }],
      });

      if (!post) {
        throw new HttpException(
          `Post with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return post;
    } catch (error) {
      throw new HttpException(
        `Post with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(
    id: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    console.log('UpdateService: ', id, userId, updatePostDto);

    try {
      const post = await this.findOne(id);
      // Check if the post belongs to the user
      if (post.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to update this post',
        );
      }

      const updatedPost = await post.update(updatePostDto as Post);

      return updatedPost;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const post = await this.findOne(id);
      await post.destroy();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPostsByUserId(userId: number): Promise<Post[]> {
    try {
      const posts = await this.postModel.findAll({
        where: { userId },
        include: [{ model: User, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
      });

      if (!posts || posts.length === 0) {
        throw new HttpException(
          `No posts found for user with id ${userId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return posts;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to find posts by user ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
