import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d'
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtCookieAuthGuard]
})
export class AuthModule {}
