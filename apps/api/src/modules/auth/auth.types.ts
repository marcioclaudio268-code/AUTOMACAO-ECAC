import type { Request } from 'express';

import type { PerfilUsuario } from '@prisma/client';

export interface AuthenticatedUser {
  email: string;
  id: string;
  nome: string;
  perfil: PerfilUsuario;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface JwtAuthPayload {
  email: string;
  perfil: PerfilUsuario;
  sub: string;
}

export interface LoginResult {
  token: string;
  user: AuthenticatedUser;
}
