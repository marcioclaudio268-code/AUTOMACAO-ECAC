import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions
} from './auth.constants';
import type { AuthenticatedRequest, AuthenticatedUser } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginDto);

    response.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    return {
      user: result.user
    };
  }

  @Get('me')
  @UseGuards(JwtCookieAuthGuard)
  me(@Req() request: AuthenticatedRequest): AuthenticatedUser {
    return request.user as AuthenticatedUser;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(
      AUTH_COOKIE_NAME,
      getClearAuthCookieOptions()
    );

    return {
      success: true
    };
  }
}
