import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, parseInt(req.user.sub, 10));
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
    @Request() req: any,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(
      id,
      parseInt(req.user.sub, 10),
      updatePostDto,
    );
  }

  @Delete(':id')
  @UseGuards(UserAccessGuard)
  async remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}
