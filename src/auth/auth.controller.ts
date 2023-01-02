import { Controller, Post, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  @Post('login')
  create(@Body() authLoginDto: AuthLoginDto) {
    return this.jwtStrategy.validate(authLoginDto);
  }
}
