\# STACK-DECISION.md



\## Projeto

\*\*ECAC AUTOMAÇÃO\*\*



\## Objetivo deste arquivo

Definir a stack oficial da V1 do projeto, evitando decisões soltas durante o desenvolvimento e impedindo expansão técnica desnecessária.



A stack da V1 foi escolhida com base em 5 critérios:



1\. confiabilidade operacional

2\. simplicidade de manutenção

3\. velocidade de desenvolvimento

4\. boa integração entre backend, frontend e jobs

5\. facilidade de evolução sem reescrever a base



\---



\## Regra principal

A V1 deve usar uma stack \*\*simples, sólida e previsível\*\*.



Não vamos começar com microserviços, múltiplos bancos, arquitetura distribuída ou soluções complexas demais para um MVP operacional interno.



A prioridade é:



\- colocar o sistema em funcionamento

\- sustentar o uso interno

\- reduzir trabalho manual do escritório

\- manter rastreabilidade e controle técnico



\---



\# STACK OFICIAL DA V1



\## 1. Organização do projeto

\### Decisão

Usar \*\*monorepo\*\*.



\### Estrutura escolhida

\- `apps/web`

\- `apps/api`

\- `packages/shared`

\- `packages/config`



\### Motivo

O projeto terá frontend, backend e compartilhamento de tipos/regras.  

O monorepo reduz duplicação, melhora consistência e facilita evolução.



\### Ferramenta escolhida

\*\*pnpm workspaces\*\*



\### Motivo

\- rápido

\- leve

\- bom para monorepo

\- bom gerenciamento de dependências

\- ótima experiência no VS Code



\---



\## 2. Linguagem principal

\### Decisão

Usar \*\*TypeScript\*\* em todo o projeto.



\### Motivo

\- reduz erro de integração entre camadas

\- melhora previsibilidade do código

\- facilita uso com IA no desenvolvimento

\- aumenta segurança em entidades, contratos e regras operacionais



\---



\## 3. Frontend

\### Decisão

Usar \*\*Next.js\*\* com \*\*App Router\*\*.



\### Motivo

\- estrutura moderna e estável

\- boa produtividade

\- boa integração com TypeScript

\- simples de escalar para painel interno

\- ótimo para telas administrativas e dashboards

\- encaixa bem com componentes reutilizáveis



\### Biblioteca de UI

\*\*React\*\*



\### Estilo

\*\*Tailwind CSS\*\*



\### Componentes base

\*\*shadcn/ui\*\*



\### Motivo da escolha do frontend

Essa combinação é prática, rápida para MVP, visualmente limpa e boa para painéis internos com filtros, tabelas, cards e fluxos operacionais.



\---



\## 4. Backend

\### Decisão

Usar \*\*NestJS\*\*.



\### Motivo

\- estrutura organizada desde o início

\- separação clara por módulos

\- boa escalabilidade sem bagunça

\- fácil de manter com domínio crescente

\- bom suporte a jobs, validação, autenticação e integração externa



\### Estilo da API

\*\*REST API\*\*



\### Motivo

\- mais simples para a V1

\- mais direta para consumo pelo frontend interno

\- menor complexidade que GraphQL no começo

\- suficiente para os fluxos operacionais do MVP



\---



\## 5. Banco de dados

\### Decisão

Usar \*\*PostgreSQL\*\*.



\### Motivo

\- confiável

\- relacional

\- excelente para entidades operacionais

\- ótimo para filtros, relacionamentos, histórico e auditoria

\- maduro e previsível para produção



\### Tipo de modelagem

Relacional, com foco em:



\- empresas

\- usuários

\- integrações

\- varreduras

\- eventos

\- pendências

\- parcelamentos

\- dívida ativa

\- competências

\- tarefas

\- evidências

\- logs



\---



\## 6. ORM

\### Decisão

Usar \*\*Prisma\*\*.



\### Motivo

\- excelente produtividade com TypeScript

\- migrations simples

\- modelagem clara

\- boa experiência para MVP

\- facilita geração e manutenção de schema

\- reduz atrito entre backend e banco



\---



\## 7. Jobs e processamento assíncrono

\### Decisão

Usar \*\*Redis + BullMQ\*\*.



\### Motivo

O sistema terá:



\- varredura diária

\- varredura semanal

\- varredura mensal

\- reprocessamento

\- tarefas agendadas

\- filas de integração



BullMQ resolve isso bem com boa previsibilidade.



\### Redis será usado para

\- fila de jobs

\- controle de execução

\- agendamento

\- prevenção básica de duplicidade

\- suporte a processamento assíncrono



\---



\## 8. Autenticação

\### Decisão

Usar \*\*autenticação própria interna\*\* com:



\- login por e-mail e senha

\- senha com hash

\- sessão baseada em \*\*JWT\*\*

\- armazenamento do token em \*\*cookie HttpOnly\*\*



\### Motivo

\- sistema interno

\- necessidade de controle direto de acesso

\- simplicidade operacional

\- independência de provedores externos na V1



\### Perfis mínimos

\- `admin`

\- `operacional`



\### Regra

Nada de login social na V1.



\---



\## 9. Validação de dados

\### Decisão

Usar:



\- \*\*class-validator\*\* e \*\*class-transformer\*\* no NestJS

\- \*\*zod\*\* no frontend e em utilitários compartilhados, quando necessário



\### Motivo

\- validar entradas no backend

\- validar formulários no frontend

\- reduzir erro de payload

\- garantir previsibilidade dos contratos



\---



\## 10. Comunicação entre frontend e backend

\### Decisão

Usar \*\*HTTP com JSON\*\*.



\### Motivo

\- simples

\- direto

\- suficiente para o MVP

\- fácil de depurar

\- ideal para painel interno operacional



\### Cliente HTTP no frontend

\*\*fetch\*\* ou camada simples própria sobre `fetch`



\### Regra

Não introduzir client complexo de dados antes da necessidade real.



\---



\## 11. Gerenciamento de estado no frontend

\### Decisão

Começar com o mínimo necessário.



\### Escolha

\- estado local do React

\- server state simples por requisição

\- contexto apenas onde realmente fizer sentido



\### Regra

Não adicionar Redux, Zustand ou outra camada global antes de dor real.



\### Motivo

A V1 é dashboard operacional interno, não aplicação pública complexa.



\---



\## 12. Tabelas e listas

\### Decisão

Usar componentes simples com boa base para filtros, paginação e ordenação.



\### Escolha

\*\*TanStack Table\*\*



\### Motivo

\- robusta

\- flexível

\- excelente para painéis administrativos

\- útil para carteira, pendências, parcelamentos e dívida ativa



\---



\## 13. Formulários

\### Decisão

Usar \*\*React Hook Form\*\*.



\### Motivo

\- simples

\- performático

\- bom com zod

\- ótimo para formulários administrativos



\---



\## 14. Logs e observabilidade

\### Decisão

Usar logs estruturados desde o início.



\### Backend

\*\*Pino\*\*



\### Motivo

\- rápido

\- estruturado

\- simples

\- ótimo para ambiente Node



\### Regras de observabilidade

Registrar no mínimo:



\- início e fim de job

\- falha de integração

\- tentativa de reprocessamento

\- erro de autenticação

\- erro de persistência

\- mudança relevante de status operacional



\---



\## 15. Armazenamento de evidências

\### Decisão da V1

Usar dois modos:



\### Desenvolvimento local

armazenamento local em pasta controlada



\### Produção

armazenamento em \*\*S3 compatível\*\*



\### Motivo

\- simples no começo

\- escalável depois

\- adequado para anexos, comprovantes, evidências e snapshots



\---



\## 16. Testes

\### Backend

\*\*Vitest\*\*



\### Frontend

\*\*Vitest\*\* para testes unitários e \*\*Playwright\*\* para fluxos críticos



\### Motivo

\- boa velocidade

\- stack moderna

\- boa integração com TypeScript

\- suficiente para testar login, cadastro, painéis e fluxos principais



\### Regra

A V1 não precisa começar com cobertura total, mas precisa testar os fluxos críticos.



\---



\## 17. Qualidade de código

\### Decisão

Usar:



\- \*\*ESLint\*\*

\- \*\*Prettier\*\*



\### Motivo

\- padronização

\- legibilidade

\- menor atrito entre ferramentas e IA

\- menor chance de bagunça estrutural



\---



\## 18. Gerenciamento de ambiente

\### Decisão

Usar arquivos `.env` separados por contexto.



\### Mínimo esperado

\- `.env`

\- `.env.example`



\### Regra

Segredos nunca devem ser versionados.



\---



\## 19. Containerização

\### Decisão

Usar \*\*Docker Compose\*\* para ambiente local do backend, banco e Redis.



\### Motivo

\- padroniza ambiente

\- reduz inconsistência local

\- acelera setup

\- ajuda no onboarding técnico



\### Serviços mínimos no compose

\- postgres

\- redis



\---



\## 20. Deploy

\### Decisão da V1

Escolher deploy simples e controlável.



\### Recomendação prática

\- frontend em ambiente compatível com Next.js

\- backend em ambiente Node com controle de variáveis e logs

\- PostgreSQL gerenciado ou servidor confiável

\- Redis dedicado ou serviço equivalente



\### Regra

Na V1, o deploy deve priorizar previsibilidade e manutenção simples, não otimização extrema.



\---



\# DECISÕES FECHADAS DA V1



\## Stack resumida oficial

\- \*\*Monorepo\*\*

\- \*\*pnpm workspaces\*\*

\- \*\*TypeScript\*\*

\- \*\*Next.js\*\*

\- \*\*Tailwind CSS\*\*

\- \*\*shadcn/ui\*\*

\- \*\*NestJS\*\*

\- \*\*REST API\*\*

\- \*\*PostgreSQL\*\*

\- \*\*Prisma\*\*

\- \*\*Redis\*\*

\- \*\*BullMQ\*\*

\- \*\*JWT em cookie HttpOnly\*\*

\- \*\*React Hook Form\*\*

\- \*\*Zod\*\*

\- \*\*TanStack Table\*\*

\- \*\*Pino\*\*

\- \*\*Vitest\*\*

\- \*\*Playwright\*\*

\- \*\*Docker Compose\*\*



\---



\# ESTRUTURA INICIAL DE PASTAS



```txt

apps/

&#x20; web/

&#x20; api/



packages/

&#x20; shared/

&#x20; config/



infra/

&#x20; docker/



docs/

