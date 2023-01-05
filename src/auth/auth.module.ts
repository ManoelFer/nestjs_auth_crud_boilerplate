import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from 'src/users/users.module';

import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    UsersRepository,
  ],
})
export class AuthModule {}
