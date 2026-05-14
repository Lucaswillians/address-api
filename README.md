# API Address

Uma API REST desenvolvida com Node.js, Express, TypeScript, Sequelize e PostgreSQL para gerenciamento de usuários, autenticação JWT, endereços e compartilhamento temporário de endereços.

---

# 📦 Funcionalidades

## 👤 Usuários

- Cadastro de usuários
- Login com JWT
- Senhas criptografadas com bcrypt

---

## 📍 Endereços

CRUD completo de endereços:

- Criar endereço
- Listar endereços do usuário autenticado
- Atualizar endereço
- Deletar endereço

Cada endereço pertence a um usuário.

---

## 🔐 Compartilhamento temporário

- Compartilhar um endereço através de uma URL única
- Expiração automática do link compartilhado
- Acesso público através do token sem autenticação

---

# 🚀 Como rodar o projeto

## 1. Clonar o projeto

```bash
git clone https://github.com/Lucaswillians/address-api/
```

## 2. Instalar dependências
```bash
  npm install
```

## 3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto, utilize de exemplo:
```bash

DATABASE_URL="postgresql://admin:admin@localhost:5432/address_db"

DB_HOST=localhost
DB_PORT=5432
DB_NAME=address_db
DB_USER=admin
DB_PASSWORD=admin

JWT_SECRET=jwttokenkeepsafe
```

## 4. Subir o PostgreSQL com Docker
```bash
  docker compose up -d
```

## 5. Rodar o projeto
```bash
  npm run dev
```

## 6. Rodar os testes:
```bash
  npm test
```

# 🗄️ Banco de dados

O banco PostgreSQL foi gerenciado utilizando o:

- Beekeeper Studio
- Caso queira local, é possivel acessar o localhost pelo pg:admin

---

# 🔑 Autenticação

A API utiliza autenticação JWT.

Rotas protegidas exigem:

```txt
Authorization: Bearer TOKEN
```

# Logs
os logs são registrados no terminal da aplicação.

# Rotas:

👤 Usuários
Criar usuário

Cria um novo usuário na aplicação.

Endpoint

```http
POST /users
```

Body
```
{
  "name": "Lucas",
  "email": "lucas@email.com",
  "password": "123456"
}
```

Resposta
```
{
  "id": "uuid",
  "name": "Lucas",
  "email": "lucas@email.com"
}
```

### 🔑 Login

Realiza autenticação do usuário e retorna um token JWT.

Endpoint
```http
POST /auth/login
```

Body
```
{
  "email": "lucas@email.com",
  "password": "123456"
}
```

Resposta
```
{
  "user": {
    "id": "uuid",
    "name": "Lucas",
    "email": "lucas@email.com"
  },
  "token": "jwt-token"
}
```

📍 Endereços
Criar endereço

### Cria um endereço vinculado ao usuário autenticado.

Endpoint
```http
POST /address
```
Autenticação

Obrigatória.

Body
```
{
  "street": "Rua XPTO",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01001000",
  "complement": "Apto 101"
}
```
### Listar endereços

Lista todos os endereços do usuário autenticado.

Endpoint
```http
GET /address
```
Autenticação

Obrigatória.

### Atualizar endereço

Atualiza um endereço pertencente ao usuário autenticado.

Endpoint
```http
PUT /address/:id
```
Autenticação

Obrigatória.

Body
```
{
  "street": "Nova Rua",
  "city": "Rio de Janeiro"
}
```
### Deletar endereço

Remove um endereço pertencente ao usuário autenticado.

Endpoint
```http
DELETE /address/:id
```
Autenticação

Obrigatória.

### 🔗 Compartilhamento de endereços
Compartilhar endereço

Gera um link temporário para compartilhamento de um endereço.

Endpoint
```http
POST /addresses/:id/share
```
Autenticação

Obrigatória.

Body
```
{
  "expiresInHours": 1
}
```
Resposta
```
{
  "token": "token-gerado",
  "expiresAt": "2026-05-12T23:00:00.000Z",
  "url": "http://localhost:3000/shared/token-gerado"
}
```
### Acessar endereço compartilhado

Permite acessar um endereço compartilhado sem autenticação.

Endpoint
```http
GET /shared/:token
```
Autenticação

Não necessária.

Regras
O token precisa existir
O link não pode estar expirado
Caso o token expire, o acesso será bloqueado




