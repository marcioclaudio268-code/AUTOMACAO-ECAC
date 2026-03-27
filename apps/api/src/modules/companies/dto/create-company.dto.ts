import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches
} from 'class-validator';
import {
  RegimeTributario,
  StatusAcessoEmpresa,
  StatusProcuracaoEmpresa
} from '@prisma/client';

import { normalizeCnpj } from '../../../common/utils/cnpj';

export class CreateCompanyDto {
  @Transform(({ value }) => normalizeCnpj(value))
  @IsString()
  @IsNotEmpty({ message: 'cnpj e obrigatorio.' })
  @Matches(/^\d{14}$/, {
    message: 'cnpj deve conter 14 digitos.'
  })
  cnpj!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value
  )
  @IsString()
  @IsNotEmpty({ message: 'razaoSocial e obrigatoria.' })
  razaoSocial!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value
  )
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsEnum(RegimeTributario, {
    message: 'regimeTributario invalido.'
  })
  regimeTributario!: RegimeTributario;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || null : value
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  responsavelInternoId?: string | null;

  @IsOptional()
  @IsEnum(StatusAcessoEmpresa)
  statusAcesso?: StatusAcessoEmpresa;

  @IsOptional()
  @IsEnum(StatusProcuracaoEmpresa)
  statusProcuracao?: StatusProcuracaoEmpresa;

  @IsOptional()
  @IsBoolean()
  naCarteira?: boolean;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value
  )
  @IsOptional()
  @IsString()
  observacoesOperacionais?: string;
}
