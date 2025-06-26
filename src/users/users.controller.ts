import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  ForbiddenException,
  ParseIntPipe,
  ValidationPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostsService } from 'src/posts/posts.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('users')
// Use filter for all "users" routes
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  // Use filter for one route
  @UseFilters(HttpExceptionFilter)
  async findAll() {
    return await this.usersService.findAll();
    // throw new ForbiddenException('You are not allowed to access this resource');
  }

  @Get(':id')
  async findOne(
    @Param('id', new DefaultValuePipe(1), ParseIntPipe) id: number,
  ) {
    return await this.usersService.findOne(id);
    // throw new ForbiddenException('You are not allowed to access this resource');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }

  @Post(':id/posts')
  async createPost(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.create(createPostDto, id);
  }

  @Get(':id/posts')
  async findPostsByUser(@Param('id') id: number) {
    return await this.postsService.findPostsByUserId(id);
  }
}
