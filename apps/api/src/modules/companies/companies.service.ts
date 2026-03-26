import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { isBasicCnpj, normalizeCnpj } from '../../common/utils/cnpj';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const listInclude = {
  responsavelInterno: {
    select: {
      ativo: true,
      email: true,
      id: true,
      nome: true,
      usuarioInternoId: true
    }
  }
} as const;

const detailInclude = {
  integracoes: {
    orderBy: {
      createdAt: 'desc'
    }
  },
  responsavelInterno: {
    include: {
      usuarioInterno: {
        select: {
          ativo: true,
          email: true,
          id: true,
          nome: true,
          perfil: true
        }
      }
    }
  }
} as const;

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    const cnpj = this.parseAndValidateCnpj(dto.cnpj);

    await this.assertResponsavelExists(dto.responsavelInternoId);
    await this.assertCnpjAvailable(cnpj);

    return this.prisma.empresa.create({
      data: {
        cnpj,
        nomeFantasia: dto.nomeFantasia?.trim() || null,
        observacoesOperacionais: dto.observacoesOperacionais?.trim() || null,
        razaoSocial: dto.razaoSocial.trim(),
        regimeTributario: dto.regimeTributario,
        responsavelInternoId: dto.responsavelInternoId,
        statusAcesso: dto.statusAcesso,
        statusProcuracao: dto.statusProcuracao
      },
      include: detailInclude
    });
  }

  async findAll() {
    return this.prisma.empresa.findMany({
      include: listInclude,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.empresa.findUnique({
      include: detailInclude,
      where: {
        id
      }
    });

    if (!company) {
      throw new NotFoundException('Empresa nao encontrada.');
    }

    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.assertCompanyExists(id);

    const data: Prisma.EmpresaUpdateInput = {};

    if (dto.cnpj !== undefined) {
      const cnpj = this.parseAndValidateCnpj(dto.cnpj);
      await this.assertCnpjAvailable(cnpj, id);
      data.cnpj = cnpj;
    }

    if (dto.razaoSocial !== undefined) {
      data.razaoSocial = dto.razaoSocial.trim();
    }

    if (dto.nomeFantasia !== undefined) {
      data.nomeFantasia = dto.nomeFantasia.trim() || null;
    }

    if (dto.regimeTributario !== undefined) {
      data.regimeTributario = dto.regimeTributario;
    }

    if (dto.responsavelInternoId !== undefined) {
      await this.assertResponsavelExists(dto.responsavelInternoId);
      data.responsavelInterno = {
        connect: {
          id: dto.responsavelInternoId
        }
      };
    }

    if (dto.statusAcesso !== undefined) {
      data.statusAcesso = dto.statusAcesso;
    }

    if (dto.statusProcuracao !== undefined) {
      data.statusProcuracao = dto.statusProcuracao;
    }

    if (dto.observacoesOperacionais !== undefined) {
      data.observacoesOperacionais = dto.observacoesOperacionais.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualizar.');
    }

    return this.prisma.empresa.update({
      data,
      include: detailInclude,
      where: {
        id
      }
    });
  }

  private parseAndValidateCnpj(value: unknown): string {
    const cnpj = normalizeCnpj(value);

    if (!cnpj || !isBasicCnpj(cnpj)) {
      throw new BadRequestException('CNPJ invalido.');
    }

    return cnpj;
  }

  private async assertCompanyExists(id: string): Promise<void> {
    const company = await this.prisma.empresa.findUnique({
      select: {
        id: true
      },
      where: {
        id
      }
    });

    if (!company) {
      throw new NotFoundException('Empresa nao encontrada.');
    }
  }

  private async assertCnpjAvailable(cnpj: string, excludeId?: string) {
    const duplicate = await this.prisma.empresa.findFirst({
      select: {
        id: true
      },
      where: {
        cnpj,
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
      throw new ConflictException('CNPJ ja cadastrado.');
    }
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
}

