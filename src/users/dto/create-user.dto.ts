import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/constants/enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role?: Role;
}
