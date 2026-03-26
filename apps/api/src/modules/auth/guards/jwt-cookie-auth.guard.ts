import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { AUTH_COOKIE_NAME, readCookieValue } from '../auth.constants';
import { AuthService } from '../services/auth.service';
import type { AuthenticatedRequest } from '../auth.types';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const token = readCookieValue(request.headers.cookie, AUTH_COOKIE_NAME);

    if (!token) {
      throw new UnauthorizedException('Nao autenticado.');
    }

    request.user = await this.authService.authenticate(token);
    return true;
  }
}
