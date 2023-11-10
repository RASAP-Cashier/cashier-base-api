import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { TokensType } from '@/types';
import { Public } from '@/common/decorators';
@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Public()
  @Post('/signup')
  async register(@Body() createUserDto: CreateUserDto): Promise<TokensType> {
    return this.authenticationService.register(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() authDto: AuthDto): Promise<TokensType> {
    return this.authenticationService.login(authDto);
  }
}
