import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  lastName: string;
}
