import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  // login
  @Public()
  @Post('login')
  async login(@Body('name') name: string) {
    return await this.authService.signIn(name);
  }

  // get me
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.authService.getMe(req.user.sub);

    return user;
  }
}
