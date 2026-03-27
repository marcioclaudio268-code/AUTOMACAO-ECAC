-- Add manual operational control fields for access and procuration.
ALTER TABLE "Empresa"
ADD COLUMN "pendenciaOperacional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ultimaConferenciaOperacionalEm" TIMESTAMP(3),
ADD COLUMN "regularizadaEm" TIMESTAMP(3);

CREATE INDEX "Empresa_pendenciaOperacional_idx" ON "Empresa"("pendenciaOperacional");
