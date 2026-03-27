-- Make the company responsible relation optional and set safe defaults for status columns.
ALTER TABLE "Empresa" ALTER COLUMN "responsavelInternoId" DROP NOT NULL;

ALTER TABLE "Empresa" ALTER COLUMN "statusAcesso" SET DEFAULT 'NAO_VERIFICADO';
ALTER TABLE "Empresa" ALTER COLUMN "statusProcuracao" SET DEFAULT 'NAO_VERIFICADA';
