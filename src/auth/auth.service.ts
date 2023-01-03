import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthLoginDto) {
    const user = await this.usersService.findOne({ email: email });
    const hash = user.password;

    const isMatch = await bcrypt.compare(password, hash);

    if (user && isMatch) {
      const payload = { username: user.name, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      //TODO: return without password
      const { password, ...result } = user;

      return { access_token, user: result };
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
