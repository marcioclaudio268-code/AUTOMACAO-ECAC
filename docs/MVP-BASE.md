\# MVP-BASE.md



\## Projeto

\*\*ECAC AUTOMAÇÃO\*\*



\## Status

\*\*Documento mestre de escopo da V1\*\*



\## Objetivo do sistema

Construir um sistema interno para escritório contábil que permita \*\*varrer automaticamente a carteira de empresas\*\*, \*\*consolidar pendências fiscais\*\*, \*\*acompanhar parcelamentos\*\*, \*\*identificar dívida ativa\*\* e \*\*organizar a apuração mensal por prioridade\*\*, reduzindo trabalho manual, repetitivo e disperso.



O sistema deve transformar a operação do escritório em \*\*fila de exceção\*\*: o time atua apenas onde houver evento, risco, pendência ou necessidade real de tratamento.



\---



\## Problema operacional que o sistema resolve

Hoje, mesmo com procurações válidas, o escritório precisa repetir manualmente, empresa por empresa:



\- consulta de pendências

\- consulta de parcelamentos

\- consulta de dívida ativa

\- conferência de situação fiscal

\- acompanhamento para apuração mensal

\- rechecagem de empresas sem alteração real



Esse processo consome tempo, gera retrabalho, aumenta o risco de esquecimento e reduz a capacidade operacional sobre uma carteira grande.



O sistema existe para eliminar a varredura cega e concentrar o esforço humano apenas no que exige decisão ou ação.



\---



\## Princípio do projeto

\*\*Confiabilidade operacional primeiro, limpeza estrutural em seguida.\*\*



Toda decisão técnica da V1 deve priorizar:



1\. estabilidade

2\. rastreabilidade

3\. controle operacional

4\. simplicidade de uso

5\. redução de trabalho manual



\---



\## O que entra na V1

A V1 deve conter apenas o núcleo operacional necessário para gerar ganho real no dia a dia do escritório.



\### 1. Cadastro central de empresas

Cada empresa deve possuir, no mínimo:



\- CNPJ

\- razão social

\- nome fantasia

\- regime tributário

\- responsável interno

\- status da procuração

\- status de integração

\- observações operacionais

\- data da última varredura

\- data do último evento relevante



\### 2. Controle de procurações e acessos

O sistema deve registrar se a empresa:



\- possui procuração válida

\- possui acesso operacional disponível

\- está apta para consulta automatizada

\- está bloqueada por ausência de acesso

\- exige tratamento manual



\### 3. Dashboard principal

Tela inicial com visão consolidada da carteira:



\- total de empresas

\- empresas OK

\- empresas com pendência

\- empresas com parcelamento

\- empresas com dívida ativa

\- empresas bloqueadas por acesso

\- empresas com falha de integração

\- empresas prontas para apuração

\- empresas bloqueadas para apuração



\### 4. Motor de varredura

O sistema deve executar varreduras automáticas para atualizar o status operacional das empresas.



A V1 deve prever:



\- varredura diária leve

\- varredura semanal completa

\- varredura mensal de fechamento



A varredura deve gerar eventos internos, como:



\- pendência detectada

\- nova dívida ativa detectada

\- parcelamento encontrado

\- parcela vencendo

\- parcela em atraso

\- falha de integração

\- empresa bloqueada por acesso

\- empresa pronta para apuração



\### 5. Painel de pendências

Lista central de tudo o que exige ação humana.



Cada pendência deve conter:



\- empresa

\- tipo

\- origem

\- descrição objetiva

\- data de detecção

\- prioridade

\- responsável

\- prazo

\- status

\- evidência vinculada



\### 6. Painel de parcelamentos

Por empresa, o sistema deve mostrar:



\- existência de parcelamento

\- situação atual

\- modalidade

\- quantidade de parcelas

\- parcela atual

\- vencimento relevante

\- indício de atraso

\- necessidade de ação



\### 7. Painel de dívida ativa

Por empresa, o sistema deve mostrar:



\- existência de dívida ativa

\- quantidade de inscrições

\- valor consolidado

\- situação identificada

\- necessidade de conferência ou tratamento



\### 8. Workspace de apuração mensal

A V1 deve organizar a apuração por competência, sem necessariamente executar cálculo tributário completo.



Estados mínimos:



\- aguardando varredura

\- pendente de análise

\- bloqueada por pendência

\- pronta para apuração

\- em apuração

\- aguardando validação

\- concluída



\### 9. Auditoria e histórico

Toda consulta, varredura, mudança de status e ação manual relevante deve deixar registro.



O sistema deve armazenar:



\- data e hora

\- empresa

\- origem da ação

\- resultado

\- usuário ou job responsável

\- observação

\- evidência quando aplicável



\### 10. Alertas internos

O sistema deve alertar o time quando houver:



\- parcela vencendo

\- parcelamento em atraso

\- nova pendência relevante

\- nova dívida ativa

\- empresa bloqueada para apuração

\- falha de integração em empresa crítica



\---



\## O que não entra na V1

A V1 não deve tentar resolver tudo. Ficam fora do escopo inicial:



\- ERP completo do escritório

\- CRM

\- módulo financeiro do escritório

\- app mobile

\- BI avançado

\- automação irrestrita de todo o e-CAC

\- robôs pesados para todos os portais

\- cálculo tributário avançado completo

\- emissão massiva de obrigações fora do núcleo operacional

\- automações secundárias que não reduzam a varredura manual



\---



\## Entidades principais

A base estrutural da V1 deve considerar as seguintes entidades:



\### Empresa

Representa cada cliente do escritório.



\### ResponsavelInterno

Representa o membro do time responsável pela empresa ou carteira.



\### IntegracaoEmpresa

Representa a situação de acesso, vínculo e disponibilidade de integração por empresa.



\### Varredura

Representa cada execução automática ou manual de coleta de status.



\### EventoOperacional

Representa cada alteração relevante detectada na varredura.



\### Pendencia

Representa tudo o que exige ação humana.



\### Parcelamento

Representa a situação consolidada de parcelamentos encontrados.



\### DividaAtiva

Representa a situação consolidada de dívida ativa encontrada.



\### CompetenciaApuracao

Representa o ciclo operacional mensal da apuração por empresa.



\### TarefaOperacional

Representa a ação manual necessária após uma pendência ou evento.



\### Evidencia

Representa arquivos, prints, logs, comprovantes ou registros anexados.



\### UsuarioInterno

Representa quem utiliza o sistema dentro do escritório.



\### LogExecucao

Representa o histórico técnico das rotinas executadas.



\---



\## Fluxo principal do sistema

O fluxo central da V1 deve funcionar assim:



\*\*1. Varredura automática\*\*  

O sistema percorre a carteira e coleta os dados disponíveis nas integrações e fluxos previstos.



\*\*2. Geração de eventos\*\*  

Toda alteração relevante gera evento operacional.



\*\*3. Classificação de criticidade\*\*  

Cada evento ou pendência recebe prioridade operacional.



\*\*4. Fila de tratamento\*\*  

As empresas entram em filas conforme risco, status e necessidade de ação.



\*\*5. Tratamento humano\*\*  

O analista atua apenas onde houver necessidade real.



\*\*6. Atualização de status\*\*  

Após o tratamento, o sistema registra histórico, evidência e novo estado operacional.



\*\*7. Organização da apuração\*\*  

A empresa segue para o fluxo mensal conforme sua situação fiscal e operacional.



\---



\## Prioridade de implementação

A construção da V1 deve seguir esta ordem:



\### Etapa 1. Base estrutural

\- repositório

\- ambiente

\- autenticação interna

\- cadastro de empresas

\- cadastro de usuários

\- estrutura mínima de banco

\- gestão de segredos

\- logs iniciais



\### Etapa 2. Núcleo operacional

\- dashboard principal

\- controle de acessos e procurações

\- motor de varredura

\- painel de pendências

\- histórico de execução



\### Etapa 3. Integrações prioritárias

\- integração com fontes prioritárias

\- leitura de parcelamentos

\- leitura de dívida ativa

\- normalização de retornos

\- classificação de eventos



\### Etapa 4. Organização da apuração

\- workspace por competência

\- bloqueios operacionais

\- checklist por empresa

\- fluxo de status da apuração



\### Etapa 5. Alertas e refinamento

\- alertas automáticos

\- filtros operacionais

\- busca rápida

\- melhorias de usabilidade

\- exportações simples quando necessárias



\---



\## Início, meio e fim do projeto



\### Início

Estruturar a base do sistema com:



\- cadastro da carteira

\- controle de procurações e acessos

\- dashboard principal

\- motor de varredura

\- painel de pendências



\### Meio

Conectar as integrações prioritárias e consolidar o núcleo operacional com:



\- leitura de parcelamentos

\- leitura de dívida ativa

\- classificação de criticidade

\- eventos operacionais

\- workspace de apuração mensal



\### Fim

Concluir a V1 quando o sistema estiver operando como centro de controle da carteira, com:



\- fila de exceção funcionando

\- alertas operacionais ativos

\- histórico e auditoria confiáveis

\- tratamento das pendências centralizado

\- apuração mensal organizada por status e prioridade



\---



\## Critério de sucesso da V1

A V1 será considerada bem-sucedida quando:



\- reduzir significativamente a varredura manual da carteira

\- reduzir acessos repetitivos a portais

\- permitir identificar pendências mais cedo

\- reduzir retrabalho operacional

\- concentrar o time nas empresas com evento real

\- dar visibilidade clara da situação de cada empresa

\- organizar a apuração mensal de forma centralizada

\- manter histórico e rastreabilidade suficientes para operação confiável



\---



\## Regra de foco da V1

Toda funcionalidade nova deve responder a esta pergunta:



\*\*Isso reduz trabalho manual recorrente, melhora priorização operacional ou aumenta confiabilidade da apuração?\*\*



Se a resposta for não, não entra na V1.



\---



\## Definição final da V1

A V1 do ECAC AUTOMAÇÃO é um \*\*hub operacional fiscal interno\*\*, focado em:



\- leitura e consolidação de status

\- monitoramento da carteira

\- geração de fila de exceção

\- tratamento organizado de pendências

\- apoio direto à apuração mensal



A V1 não é um ERP.

A V1 não é um sistema genérico.

A V1 é uma ferramenta de escala operacional para o escritório.



\---



\## Observação de condução do projeto

Este projeto deve ser conduzido com escopo controlado, sem expansão prematura e sem adicionar módulos que não tenham impacto direto no ganho operacional da carteira atendida.

