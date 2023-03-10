import { Controller, Post, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';

import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }
}
