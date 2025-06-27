import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Post } from 'src/posts/models/post.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { name: createUserDto.name },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userModel.create(createUserDto as User);

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { id },
      include: [
        {
          model: Post,
          as: 'posts',
        },
      ],
    });

    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByName(name: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        where: { name },
      });

      if (!user) {
        throw new HttpException(
          `User with name ${name} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to find user by name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await user.update(updateUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await user.destroy();
      return `User with id ${id} deleted successfully`;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
