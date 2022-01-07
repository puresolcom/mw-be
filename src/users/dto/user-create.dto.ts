// create user dto class

import { IsEmail, IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsUnique } from 'src/validators/unique.validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Validate(IsUnique, [{ model: 'user' }])
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
