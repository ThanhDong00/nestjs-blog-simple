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
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostsService } from 'src/posts/posts.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/enum';
import { UserAccessGuard } from 'src/common/guards/user-access.guard';

@Controller('users')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(UserAccessGuard)
  async findOne(
    @Param('id', new DefaultValuePipe(1), ParseIntPipe) id: number,
  ) {
    return await this.usersService.findOne(id);
  }

  // This route is for the current user
  @Patch()
  async update(
    @Request() req: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(req.user.sub, updateUserDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }

  // Posts related to users
  @Post(':id/posts')
  async createPost(
    @Request() req: any,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
  ) {
    return await this.postsService.create(
      createPostDto,
      parseInt(req.user.sub, 10),
    );
  }

  @Get(':id/posts')
  async findPostsByUser(@Param('id') id: number) {
    return await this.postsService.findPostsByUserId(id);
  }
}
