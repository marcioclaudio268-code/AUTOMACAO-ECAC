import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'senha nao pode estar vazia.'
  })
  senha!: string;
}
