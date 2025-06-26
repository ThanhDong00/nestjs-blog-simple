import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  // login
  @Post('login')
  async login(@Body('name') name: string) {
    return await this.authService.signIn(name);
  }

  // get me
  @Get('me')
  async getMe(@Query('id') id: number) {
    console.log('getMe called with id:', id);
    return await this.authService.getMe(id);
  }
}
