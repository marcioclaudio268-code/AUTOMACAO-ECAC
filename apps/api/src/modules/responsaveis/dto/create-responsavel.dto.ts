import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResponsavelDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'nome e obrigatorio.' })
  nome!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  @IsNotEmpty({ message: 'email e obrigatorio.' })
  @IsEmail({}, { message: 'email invalido.' })
  email!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'usuarioInternoId e obrigatorio.' })
  usuarioInternoId!: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }

    return value;
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
