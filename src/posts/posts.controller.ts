import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UserAccessGuard } from 'src/common/guards/user-access.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @User('sub') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  @Public()
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @User('sub', ParseIntPipe) userId: number,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(UserAccessGuard)
  async remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}
