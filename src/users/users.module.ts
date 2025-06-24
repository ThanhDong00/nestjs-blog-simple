import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), PostsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
