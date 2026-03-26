import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, PerfilUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';
import type {
  AuthenticatedUser,
  JwtAuthPayload,
  LoginResult
} from '../auth.types';

const userSelect = {
  ativo: true,
  email: true,
  id: true,
  nome: true,
  perfil: true,
  senhaHash: true
} satisfies Prisma.UsuarioInternoSelect;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.usuarioInterno.findUnique({
      select: userSelect,
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    if (!user.ativo) {
      throw new ForbiddenException('Usuario inativo.');
    }

    const passwordMatches = await bcrypt.compare(dto.senha, user.senhaHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    return {
      token: await this.jwtService.signAsync({
        email: user.email,
        perfil: user.perfil,
        sub: user.id
      }),
      user: this.toAuthenticatedUser(user)
    };
  }

  async authenticate(token: string): Promise<AuthenticatedUser> {
    let payload: JwtAuthPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtAuthPayload>(token);
    } catch {
      throw new UnauthorizedException('Nao autenticado.');
    }

    const user = await this.prisma.usuarioInterno.findUnique({
      select: {
        ativo: true,
        email: true,
        id: true,
        nome: true,
        perfil: true
      },
      where: {
        id: payload.sub
      }
    });

    if (!user) {
      throw new UnauthorizedException('Nao autenticado.');
    }

    if (!user.ativo) {
      throw new ForbiddenException('Usuario inativo.');
    }

    return this.toAuthenticatedUser(user);
  }

  private toAuthenticatedUser(user: {
    email: string;
    id: string;
    nome: string;
    perfil: PerfilUsuario;
  }): AuthenticatedUser {
    return {
      email: user.email,
      id: user.id,
      nome: user.nome,
      perfil: user.perfil
    };
  }
}
