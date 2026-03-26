import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

const responsavelInclude = {
  usuarioInterno: {
    select: {
      ativo: true,
      email: true,
      id: true,
      nome: true,
      perfil: true
    }
  }
} as const;

@Injectable()
export class ResponsaveisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateResponsavelDto) {
    const nome = this.normalizeText(dto.nome);
    const email = this.normalizeEmail(dto.email);
    const usuarioInternoId = this.normalizeText(dto.usuarioInternoId);

    await this.assertUsuarioInternoExists(usuarioInternoId);
    await this.assertEmailAvailable(email);

    const data: Prisma.ResponsavelInternoCreateInput = {
      ativo: dto.ativo ?? true,
      email,
      nome,
      usuarioInterno: {
        connect: {
          id: usuarioInternoId
        }
      }
    };

    return this.prisma.responsavelInterno.create({
      data,
      include: responsavelInclude
    });
  }

  async findAll() {
    return this.prisma.responsavelInterno.findMany({
      include: responsavelInclude,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const responsavel = await this.prisma.responsavelInterno.findUnique({
      include: responsavelInclude,
      where: {
        id
      }
    });

    if (!responsavel) {
      throw new NotFoundException('Responsavel interno nao encontrado.');
    }

    return responsavel;
  }

  async update(id: string, dto: UpdateResponsavelDto) {
    await this.assertResponsavelExists(id);

    const data: Prisma.ResponsavelInternoUpdateInput = {};

    if (dto.nome !== undefined) {
      data.nome = this.normalizeText(dto.nome);
    }

    if (dto.email !== undefined) {
      const email = this.normalizeEmail(dto.email);
      await this.assertEmailAvailable(email, id);
      data.email = email;
    }

    if (dto.usuarioInternoId !== undefined) {
      const usuarioInternoId = this.normalizeText(dto.usuarioInternoId);
      await this.assertUsuarioInternoExists(usuarioInternoId);
      data.usuarioInterno = {
        connect: {
          id: usuarioInternoId
        }
      };
    }

    if (dto.ativo !== undefined) {
      data.ativo = dto.ativo;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    return this.prisma.responsavelInterno.update({
      data,
      include: responsavelInclude,
      where: {
        id
      }
    });
  }

  private normalizeText(value: string) {
    return value.trim();
  }

  private normalizeEmail(value: string) {
    return value.trim().toLowerCase();
  }

  private async assertResponsavelExists(id: string) {
    const responsavel = await this.prisma.responsavelInterno.findUnique({
      select: {
        id: true
      },
      where: {
        id
      }
    });

    if (!responsavel) {
      throw new NotFoundException('Responsavel interno nao encontrado.');
    }
  }

  private async assertEmailAvailable(email: string, excludeId?: string) {
    const duplicate = await this.prisma.responsavelInterno.findFirst({
      select: {
        id: true
      },
      where: {
        email,
        ...(excludeId
          ? {
              NOT: {
                id: excludeId
              }
            }
          : {})
      }
    });

    if (duplicate) {
      throw new ConflictException('Email ja cadastrado.');
    }
  }

  private async assertUsuarioInternoExists(id: string) {
    const usuarioInterno = await this.prisma.usuarioInterno.findUnique({
      select: {
        id: true
      },
      where: {
        id
      }
    });

    if (!usuarioInterno) {
      throw new NotFoundException('Usuario interno nao encontrado.');
    }
  }
}
