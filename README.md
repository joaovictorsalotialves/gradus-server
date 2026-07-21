# gradus-server

## RFs (Requisitos funcionais)
- [x] Deve ser possível visualizar uma tarefa
- [ ] Deve ser possível listar todas as tarefas
- [ ] Deve ser possível listar todas as tarefas atrasadas
- [ ] Deve ser possível listar todas as tarefas concluídas
- [ ] Deve ser possível listar todas as tarefas pendentes
- [ ] Deve ser possível filtrar as tarefas pelo título
- [ ] Deve ser possível ordenar as tarefas por data de criação
- [ ] Deve ser possível ordenar as tarefas por prazo de conclusão
- [x] Deve ser possível cadastrar uma tarefa
- [x] Deve ser possível alterar uma tarefa
- [x] Deve ser possível marcar como concluída uma tarefa
- [x] Deve ser possível desmarcar uma tarefa como concluída
- [x] Deve ser possível deletar uma tarefa

## RNs (Regras de negócio)
- [x] O título da tarefa é obrigatório
- [x] A data de vencimento da tarefa é obrigatória
- [x] Não é permitido definir uma data limite anterior à data de criação da tarefa
- [x] O slug deve ser gerado automaticamente a partir do título da tarefa
- [x] O slug deve ser único
- [x] Uma tarefa concluída não pode ser editada
- [ ] A operação de concluir uma tarefa deve ser idempotente (executá-la mais de uma vez não altera o estado da tarefa nem gera erro)
- [ ] A operação de desmarcar uma tarefa como concluída deve ser idempotente (executá-la mais de uma vez não altera o estado da tarefa nem gera erro)
- [ ] Apenas tarefas pendentes podem ser marcadas como concluídas
- [ ] Uma tarefa atrasada é aquela cuja data limite é anterior à data atual e ainda não foi concluída
- [x] A exclusão de tarefas deve utilizar Soft Delete
- [x] Não é permitido restaurar uma tarefa excluída
- [x] Excluir uma tarefa já excluida deve ser idempotente (executá-la mais de uma vez não altera o estado da tarefa nem gera erro)

## RNFs (Requisitos não funcionais)
- [ ] Os dados da aplicação devem estar persistidos em um banco de dados PostgreSQL
- [ ] As listagens devem ser paginadas, retornando no máximo 10 registros por página
- [ ] A aplicação deve estar dockerizada
- [ ] A API deve seguir o padrão REST
- [ ] A aplicação deve possuir testes unitários
- [ ] A aplicação deve possuir testes e2e

## Entidade

```
Task
----
id
title
description
status
slug
dueDate
completedAt
createdAt
updatedAt
deletedAt
```

## Endpoints

```http
POST   /tasks
GET    /tasks?page=1
GET    /tasks/:slug
PATCH  /tasks/:slug
DELETE /tasks/:slug

PATCH  /tasks/:slug/complete
PATCH  /tasks/:slug/uncomplete

GET /tasks?status=pending
GET /tasks?status=completed
GET /tasks?status=overdue

GET /tasks?search=title

GET /tasks?sort=createdAt&order=asc
GET /tasks?sort=createdAt&order=desc
GET /tasks?sort=dueDate
```
