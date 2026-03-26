-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'OPERACIONAL');

-- CreateEnum
CREATE TYPE "StatusAcessoEmpresa" AS ENUM ('DISPONIVEL', 'INDISPONIVEL', 'BLOQUEADO', 'NAO_VERIFICADO');

-- CreateEnum
CREATE TYPE "StatusProcuracaoEmpresa" AS ENUM ('VALIDA', 'INVALIDA', 'PENDENTE', 'NAO_VERIFICADA');

-- CreateEnum
CREATE TYPE "TipoIntegracao" AS ENUM ('MANUAL', 'API', 'RPA');

-- CreateEnum
CREATE TYPE "StatusIntegracao" AS ENUM ('ATIVA', 'INATIVA', 'ERRO', 'NAO_CONFIGURADA');

-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'OUTRO');

-- CreateTable
CREATE TABLE "UsuarioInterno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioInterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsavelInterno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuarioInternoId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponsavelInterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "regimeTributario" "RegimeTributario" NOT NULL,
    "responsavelInternoId" TEXT NOT NULL,
    "statusAcesso" "StatusAcessoEmpresa" NOT NULL,
    "statusProcuracao" "StatusProcuracaoEmpresa" NOT NULL,
    "observacoesOperacionais" TEXT,
    "ultimaVarreduraEm" TIMESTAMP(3),
    "ultimoEventoRelevanteEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegracaoEmpresa" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoIntegracao" "TipoIntegracao" NOT NULL,
    "statusIntegracao" "StatusIntegracao" NOT NULL,
    "ultimoSucessoEm" TIMESTAMP(3),
    "ultimoErroEm" TIMESTAMP(3),
    "mensagemErroAtual" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegracaoEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioInterno_email_key" ON "UsuarioInterno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ResponsavelInterno_email_key" ON "ResponsavelInterno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE INDEX "ResponsavelInterno_usuarioInternoId_idx" ON "ResponsavelInterno"("usuarioInternoId");

-- CreateIndex
CREATE INDEX "Empresa_responsavelInternoId_idx" ON "Empresa"("responsavelInternoId");

-- CreateIndex
CREATE INDEX "IntegracaoEmpresa_empresaId_idx" ON "IntegracaoEmpresa"("empresaId");

-- AddForeignKey
ALTER TABLE "ResponsavelInterno" ADD CONSTRAINT "ResponsavelInterno_usuarioInternoId_fkey" FOREIGN KEY ("usuarioInternoId") REFERENCES "UsuarioInterno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_responsavelInternoId_fkey" FOREIGN KEY ("responsavelInternoId") REFERENCES "ResponsavelInterno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegracaoEmpresa" ADD CONSTRAINT "IntegracaoEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

