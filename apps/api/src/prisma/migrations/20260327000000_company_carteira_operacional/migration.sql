ALTER TABLE "Empresa"
ADD COLUMN "naCarteira" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Empresa_naCarteira_idx" ON "Empresa"("naCarteira");
