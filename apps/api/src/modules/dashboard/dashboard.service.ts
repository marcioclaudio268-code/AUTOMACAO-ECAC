import { Injectable } from '@nestjs/common';
import { Prisma, StatusAcessoEmpresa, StatusProcuracaoEmpresa } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

type DashboardResponsavelResumo = {
  quantidadeEmpresas: number;
  responsavelInternoEmail: string | null;
  responsavelInternoId: string | null;
  responsavelInternoNome: string;
};

export type DashboardSummary = {
  distribuicaoPorResponsavel: DashboardResponsavelResumo[];
  indicadores: {
    totalEmpresasNaCarteira: number;
    totalEmpresasComAcessoPendenteOuBloqueado: number;
    totalEmpresasComPendenciaOperacional: number;
    totalEmpresasComProcuracaoPendente: number;
  };
};

const accessAttentionStatuses: StatusAcessoEmpresa[] = [
  StatusAcessoEmpresa.BLOQUEADO,
  StatusAcessoEmpresa.INDISPONIVEL,
  StatusAcessoEmpresa.NAO_VERIFICADO
];

const procuracaoAttentionStatuses: StatusProcuracaoEmpresa[] = [
  StatusProcuracaoEmpresa.INVALIDA,
  StatusProcuracaoEmpresa.NAO_VERIFICADA,
  StatusProcuracaoEmpresa.PENDENTE
];

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<DashboardSummary> {
    const carteiraWhere: Prisma.EmpresaWhereInput = {
      naCarteira: true
    };

    const [
      totalEmpresasNaCarteira,
      totalEmpresasComPendenciaOperacional,
      totalEmpresasComAcessoPendenteOuBloqueado,
      totalEmpresasComProcuracaoPendente,
      empresasNaCarteira
    ] = await Promise.all([
      this.prisma.empresa.count({
        where: carteiraWhere
      }),
      this.prisma.empresa.count({
        where: {
          ...carteiraWhere,
          pendenciaOperacional: true
        }
      }),
      this.prisma.empresa.count({
        where: {
          ...carteiraWhere,
          statusAcesso: {
            in: accessAttentionStatuses
          }
        }
      }),
      this.prisma.empresa.count({
        where: {
          ...carteiraWhere,
          statusProcuracao: {
            in: procuracaoAttentionStatuses
          }
        }
      }),
      this.prisma.empresa.findMany({
        orderBy: {
          createdAt: 'asc'
        },
        select: {
          responsavelInterno: {
            select: {
              email: true,
              id: true,
              nome: true
            }
          },
          responsavelInternoId: true
        },
        where: carteiraWhere
      })
    ]);

    const responsaveisMap = new Map<string, DashboardResponsavelResumo>();

    for (const empresa of empresasNaCarteira) {
      const key = empresa.responsavelInternoId ?? '__sem_responsavel__';
      const current = responsaveisMap.get(key);

      if (current) {
        current.quantidadeEmpresas += 1;
        continue;
      }

      responsaveisMap.set(key, {
        quantidadeEmpresas: 1,
        responsavelInternoEmail: empresa.responsavelInterno?.email ?? null,
        responsavelInternoId: empresa.responsavelInterno?.id ?? null,
        responsavelInternoNome: empresa.responsavelInterno?.nome ?? 'Sem responsavel'
      });
    }

    const collator = new Intl.Collator('pt-BR', {
      sensitivity: 'base'
    });

    const distribuicaoPorResponsavel = Array.from(responsaveisMap.values()).sort(
      (left, right) => {
        const leftSemResponsavel = left.responsavelInternoId === null;
        const rightSemResponsavel = right.responsavelInternoId === null;

        if (leftSemResponsavel !== rightSemResponsavel) {
          return leftSemResponsavel ? 1 : -1;
        }

        if (left.quantidadeEmpresas !== right.quantidadeEmpresas) {
          return right.quantidadeEmpresas - left.quantidadeEmpresas;
        }

        return collator.compare(
          left.responsavelInternoNome,
          right.responsavelInternoNome
        );
      }
    );

    return {
      distribuicaoPorResponsavel,
      indicadores: {
        totalEmpresasComAcessoPendenteOuBloqueado,
        totalEmpresasComPendenciaOperacional,
        totalEmpresasComProcuracaoPendente,
        totalEmpresasNaCarteira
      }
    };
  }
}
