# ARCHITECTURE-V1.md

## Projeto
**ECAC AUTOMAÇÃO**

## Objetivo deste arquivo
Definir a arquitetura técnica da V1 do sistema, com foco em confiabilidade operacional, rastreabilidade, simplicidade de manutenção e evolução segura.

Este documento existe para impedir decisões estruturais improvisadas durante o desenvolvimento.

---

## Princípio arquitetural da V1
A arquitetura da V1 deve seguir esta ordem de prioridade:

1. confiabilidade operacional
2. clareza estrutural
3. rastreabilidade
4. simplicidade de manutenção
5. evolução incremental sem reescrita da base

A V1 não será construída como arquitetura distribuída, nem como sistema superfragmentado.

A base será uma arquitetura modular, organizada por domínio, em monorepo, com backend centralizado, frontend administrativo e jobs controlados.

---

# VISÃO GERAL DA ARQUITETURA

## Estrutura macro
O sistema será composto por 4 blocos principais:

### 1. Frontend administrativo
Responsável pela interface interna do escritório.

Funções principais:
- dashboard
- listagem de empresas
- visualização de pendências
- visualização de parcelamentos
- visualização de dívida ativa
- workspace de apuração
- filtros, buscas e ações operacionais

### 2. Backend central
Responsável por:

- regras de negócio
- autenticação
- API interna
- persistência
- orquestração dos fluxos
- integração com fontes externas
- geração de eventos
- geração de pendências
- controle de apuração
- auditoria

### 3. Banco de dados relacional
Responsável por armazenar:

- entidades operacionais
- histórico
- vínculos entre módulos
- rastreabilidade
- estados atuais e históricos relevantes

### 4. Camada de jobs e varredura
Responsável por:

- execuções agendadas
- varreduras da carteira
- reprocessamentos
- filas de integração
- execução assíncrona controlada
- detecção de mudanças
- registro técnico de execução

---

# DESENHO LÓGICO DA V1

```txt
Usuário Interno
   ↓
Frontend Administrativo (Next.js)
   ↓
REST API (NestJS)
   ↓
Camada de Aplicação / Módulos de Domínio
   ↓
Banco de Dados (PostgreSQL)
   ↓
Camada de Integração / Jobs / Filas (Redis + BullMQ)
   ↓
Fontes Externas Prioritárias# ARCHITECTURE-V1.md

## Projeto
**ECAC AUTOMAÇÃO**

## Objetivo deste arquivo
Definir a arquitetura técnica da V1 do sistema, com foco em confiabilidade operacional, rastreabilidade, simplicidade de manutenção e evolução segura.

Este documento existe para impedir decisões estruturais improvisadas durante o desenvolvimento.

---

## Princípio arquitetural da V1
A arquitetura da V1 deve seguir esta ordem de prioridade:

1. confiabilidade operacional
2. clareza estrutural
3. rastreabilidade
4. simplicidade de manutenção
5. evolução incremental sem reescrita da base

A V1 não será construída como arquitetura distribuída, nem como sistema superfragmentado.

A base será uma arquitetura modular, organizada por domínio, em monorepo, com backend centralizado, frontend administrativo e jobs controlados.

---

# VISÃO GERAL DA ARQUITETURA

## Estrutura macro
O sistema será composto por 4 blocos principais:

### 1. Frontend administrativo
Responsável pela interface interna do escritório.

Funções principais:
- dashboard
- listagem de empresas
- visualização de pendências
- visualização de parcelamentos
- visualização de dívida ativa
- workspace de apuração
- filtros, buscas e ações operacionais

### 2. Backend central
Responsável por:

- regras de negócio
- autenticação
- API interna
- persistência
- orquestração dos fluxos
- integração com fontes externas
- geração de eventos
- geração de pendências
- controle de apuração
- auditoria

### 3. Banco de dados relacional
Responsável por armazenar:

- entidades operacionais
- histórico
- vínculos entre módulos
- rastreabilidade
- estados atuais e históricos relevantes

### 4. Camada de jobs e varredura
Responsável por:

- execuções agendadas
- varreduras da carteira
- reprocessamentos
- filas de integração
- execução assíncrona controlada
- detecção de mudanças
- registro técnico de execução

---

# DESENHO LÓGICO DA V1

```txt
Usuário Interno
   ↓
Frontend Administrativo (Next.js)
   ↓
REST API (NestJS)
   ↓
Camada de Aplicação / Módulos de Domínio
   ↓
Banco de Dados (PostgreSQL)
   ↓
Camada de Integração / Jobs / Filas (Redis + BullMQ)
   ↓
Fontes Externas Prioritárias