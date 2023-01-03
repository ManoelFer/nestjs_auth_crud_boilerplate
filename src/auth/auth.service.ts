import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { exclude } from 'src/helpers/exclude_fields';

import { UsersService } from 'src/users/users.service';

import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ username, password }: AuthLoginDto): Promise<any> {
    const user = await this.usersService.findOne({ email: username });
    const hash = user.password;

    const isMatch = await bcrypt.compare(password, hash);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userInDB = await this.usersService.findOne({ email: user.username });

    const payload = {
      username: user.username,
      password: user.password,
      sub: userInDB.id,
    };

    //TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
    const userWithoutPassword = exclude(userInDB, ['password']);

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
