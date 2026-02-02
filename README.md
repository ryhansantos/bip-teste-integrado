# 🧩 Projeto de Benefícios – Arquitetura Backend Multimódulo

Este projeto foi desenvolvido como parte de um desafio técnico para o processo seletivo.  
Mesmo sendo um desafio, tentei tratar a solução como um projeto real, com decisões de
arquitetura pensadas para facilitar manutenção, entendimento e possíveis evoluções no
futuro, sem complicar mais do que o necessário.

---

## 📦 Visão geral dos módulos

```
bip-teste-integrado
│
├── db/
├── ejb-module/
├── backend-module/
├── frontend/
├── docs/
└── .github/workflows/
```

A ideia principal foi separar os projetos em módulos, usando um projeto pai apenas como
agregador. Isso facilita o build, o gerenciamento de dependências e deixa mais claro o papel
de cada parte do sistema.

Com essa separação acredito que consegui:

- isolamento real da regra de negócio  
- builds mais previsíveis  
- menor acoplamento entre camadas  
- possibilidade de evolução ou substituição de módulos no futuro  
- mais clareza para quem pega o projeto pela primeira vez  

---

## 🗄️ Módulo db

Seguindo o padrão do projeto, foi utilizado um banco H2 em memória, principalmente para
facilitar a execução e os testes locais, sem a necessidade de configurar nada externo.

Esse módulo é responsável apenas pelo **estado inicial do banco**.

Conteúdo:
- `schema.sql`: definição das tabelas  
- `seed.sql`: carga inicial de dados para testes  

---

## 🧠 Módulo ejb-module

Neste módulo está concentrado tudo que envolve:

- validação  
- consistência  
- transações  
- regras de negócio  

A intenção foi manter toda a lógica crítica aqui, evitando espalhar regras importantes por
outras camadas do sistema.

### Sobre a transferência de benefícios

A transferência foi implementada de forma que:

- o saldo é validado antes de qualquer alteração, evitando transferências sem saldo suficiente  
- o benefício é validado para garantir que existe e que não está sendo transferido para ele mesmo  
- a operação acontece dentro de uma única transação  
- qualquer falha invalida toda a operação  
- não existe estado intermediário inconsistente  
- nenhuma regra de negócio foi duplicada fora do EJB  

Foi corrigido também um problema de **lost update** em cenários de acesso simultâneo.  
Para isso utilizei **optimistic locking**, através do campo `@Version` da entidade. Com isso,
o EJB consegue detectar atualizações concorrentes e impedir que uma transferência sobrescreva
o estado de outra de forma silenciosa.

Essa abordagem foi escolhida por manter o sistema mais leve e escalável, já que o cenário
esperado não é de contenção constante, mas sim de conflitos ocasionais. Quando um conflito
acontece, a transação falha e é revertida automaticamente, evitando qualquer estado
inconsistente.

---

## 🌐 Módulo backend-module

O backend em Spring Boot funciona basicamente como uma camada de integração entre o mundo
externo e os serviços do EJB.

Responsabilidades principais:
- exposição de endpoints REST  
- validação básica de entrada  
- conversão de DTOs  
- delegação das chamadas para o EJB  
- tratamento de erros e mapeamento HTTP  

A ideia aqui foi manter o backend simples e desacoplado, sem replicar regras de negócio que já
existem no módulo EJB.

---

## 🔁 Fluxo de transferência

1. A requisição chega via API REST  
2. O backend valida os dados básicos  
3. A chamada é delegada ao EJB  
4. O EJB executa a regra de negócio  
5. Em caso de sucesso, a transação é confirmada  
6. Em caso de falha, ocorre rollback completo  

---

## 🧪 Testes

Os testes foram concentrados no módulo EJB, que é onde a regra de negócio realmente vive.

O foco principal foi validar:
- comportamento correto da transferência  
- validações de saldo  
- cenários de erro esperados  

---

## 📘 Documentação da API

A API REST é documentada via Swagger, funcionando como um contrato claro entre backend e
frontend, facilitando tanto o desenvolvimento quanto o consumo dos endpoints.

---

## 🎨 Frontend

O frontend foi desenvolvido utilizando Angular, com foco em simplicidade, clareza e
alinhamento com o contrato definido pela API.

A preocupação principal não foi criar algo visualmente sofisticado, mas sim entregar um
frontend funcional, previsível e fácil de entender.

### Organização

A estrutura do frontend foi mantida bem direta:

```
src/app
│
├── pages/
│   ├── beneficios/
│   ├── beneficios-novo/
│   └── beneficios-transferir/
│
├── services/
│   └── beneficios.service.ts
│
├── models/
│   └── beneficio.model.ts
│
├── app.routes.ts
└── app.ts
```

Cada página representa uma responsabilidade clara:
- listagem de benefícios  
- criação e edição de benefícios  
- transferência entre benefícios  

---

### Componentes standalone

Foi adotado o uso de **standalone components**, principalmente para reduzir boilerplate e
evitar a criação de módulos artificiais sem real necessidade.

Cada componente declara explicitamente suas dependências, o que deixa o código mais
previsível e fácil de acompanhar.

---

### Integração com o backend

Toda a comunicação com o backend é centralizada no `BeneficiosService`.

Ele é responsável por:
- listar benefícios  
- criar novos benefícios  
- editar benefícios existentes  
- remover benefícios  
- realizar transferências  

O frontend segue o padrão REST de forma explícita:
- o `id` é enviado apenas pela URL nas operações de edição  
- o corpo da requisição representa somente o estado editável do recurso  

---

### Validações

A validação foi implementada em duas camadas.

No **frontend**:
- validações simples e imediatas para melhorar a experiência do usuário  
- feedback visual direto nos campos  

No **backend**:
- validações definitivas usando Jakarta Validation  
- mensagens retornadas de forma padronizada  

O frontend está preparado para consumir essas mensagens e exibi-las diretamente nos campos
correspondentes, evitando mensagens genéricas e melhorando a clareza para o usuário.

---

### Criação, edição e transferência

A mesma tela é utilizada tanto para criação quanto para edição de benefícios, diferenciando o
comportamento com base na rota acessada.

A transferência possui uma página dedicada, refletindo exatamente o comportamento definido
no backend, sem duplicar regra de negócio.

---

### Interface

O layout foi mantido simples e consistente entre as telas, priorizando:
- legibilidade  
- clareza das ações  
- feedback visual para erros  

A ideia foi entregar uma interface funcional e coerente com o escopo do desafio, sem adicionar
complexidade apenas por estética.

---

## 🧠 Considerações finais

Todo o código desenvolvido foi pensado a partir das minhas experiências anteriores como
desenvolvedor, junto com o conhecimento adquirido atualmente na pós-graduação em Engenharia
de Software em Java.

A intenção foi tratar o desafio como um projeto real. Buscando uma solução correta, consistente e fácil de evoluir.
