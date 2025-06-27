import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        'Failed to register user' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(name: string): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findByName(name);

      const payload = { sub: user.id, name: user.name, role: user.role };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to login user' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMe(id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve user' + error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
