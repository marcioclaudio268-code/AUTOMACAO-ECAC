import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  StatusAcessoEmpresa,
  StatusProcuracaoEmpresa
} from '@prisma/client';

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return value as boolean;
}

function parseOptionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export class ListCompaniesQueryDto {
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsOptional()
  @IsBoolean()
  naCarteira?: boolean;

  @Transform(({ value }) => parseOptionalText(value))
  @IsOptional()
  @IsString()
  responsavelInternoId?: string;

  @IsOptional()
  @IsEnum(StatusAcessoEmpresa)
  statusAcesso?: StatusAcessoEmpresa;

  @IsOptional()
  @IsEnum(StatusProcuracaoEmpresa)
  statusProcuracao?: StatusProcuracaoEmpresa;
}
