import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(authLoginDto: AuthLoginDto): Promise<any> {
    const user = await this.authService.validateUser(authLoginDto);
    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('this :>> ', user);
    return user;
  }
}
