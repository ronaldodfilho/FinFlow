<div align="center">
  <h1>⚡ FinFlow</h1>
  <p><strong>Sistema Financeiro Full Stack Moderno</strong></p>
  <p>ERP Financeiro corporativo inspirado em plataformas como Nubank, Stripe e Inter</p>

  <img src="https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</div>

---

## 📋 Sobre o Projeto

O **FinFlow** é uma aplicação SaaS financeira full stack de nível profissional, desenvolvida com as tecnologias mais modernas do mercado. O projeto demonstra domínio completo de:

- **Arquitetura de Software**: Separação de camadas (Controllers → Services → Repositories)
- **Segurança**: Autenticação stateless com JWT + Spring Security
- **Open Finance**: Simulação de integração bancária com importação automática de transações
- **DevOps**: CI/CD com GitHub Actions, containerização com Docker

---

## 🚀 Funcionalidades

| Módulo | Funcionalidades |
|---|---|
| **Autenticação** | Login, Registro, JWT, Proteção de Rotas, Logout |
| **Dashboard** | Saldo total, Receitas, Despesas, Gráfico de Fluxo Mensal, Últimas Transações |
| **Transações** | CRUD completo, Filtro por tipo, Busca por texto, Tag Open Finance |
| **Contas a Pagar** | CRUD completo, Status (Pendente/Pago/Atrasado), Marcar como Pago |
| **Contas a Receber** | CRUD completo, Status, Marcar como Recebido |
| **Open Finance** | Botão de sincronização, importação automática de transações mock |

---

## 🛠️ Stack Tecnológica

### Backend
- **Java 17** + **Spring Boot 3.2**
- **Spring Security** com autenticação JWT (JJWT)
- **Spring Data JPA** + **Hibernate** (ORM)
- **PostgreSQL** (banco de dados)
- **Springdoc OpenAPI** (Swagger UI)
- **BCrypt** para hashing de senhas

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (design system premium dark mode)
- **Zustand** (gerenciamento de estado global)
- **Axios** com interceptors JWT
- **Recharts** (gráficos financeiros)
- **Lucide React** (ícones)
- **React Router DOM** (roteamento)

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** (CI/CD)

---

## 🏗️ Arquitetura

```
FinFlow/
├── backend/                          # API Spring Boot
│   ├── src/main/java/com/finflow/
│   │   ├── controllers/              # Endpoints REST
│   │   ├── models/                   # Entidades JPA
│   │   ├── repositories/             # Interfaces Spring Data JPA
│   │   ├── security/                 # JWT + Spring Security
│   │   └── dtos/                     # Data Transfer Objects
│   ├── src/main/resources/
│   │   └── application.yml           # Configurações
│   └── pom.xml
│
├── frontend/                         # Aplicação React
│   ├── src/
│   │   ├── components/               # Componentes reutilizáveis
│   │   ├── pages/                    # Páginas da aplicação
│   │   ├── store/                    # Zustand stores
│   │   └── services/                 # Integração com API (Axios)
│   ├── tailwind.config.js
│   └── package.json
│
├── .github/workflows/ci-cd.yml       # Pipeline CI/CD
└── docker-compose.yml                # Orquestração de containers
```

---

## ▶️ Como Executar

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Java 17+](https://adoptium.net/)
- [Node.js 20+](https://nodejs.org/)

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/finflow.git
cd finflow
```

### 2. Subir o banco de dados PostgreSQL
```bash
docker-compose up -d
```

### 3. Executar o Backend
```bash
cd backend
./mvnw spring-boot:run
```
> API disponível em: `http://localhost:8080`  
> Swagger UI em: `http://localhost:8080/swagger-ui.html`

### 4. Executar o Frontend
```bash
cd frontend
npm install
npm run dev
```
> Aplicação disponível em: `http://localhost:5173`

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registrar usuário | ❌ |
| `POST` | `/api/auth/login` | Login e obter JWT | ❌ |
| `GET` | `/api/transactions` | Listar transações | ✅ |
| `POST` | `/api/transactions` | Criar transação | ✅ |
| `PUT` | `/api/transactions/{id}` | Atualizar transação | ✅ |
| `DELETE` | `/api/transactions/{id}` | Remover transação | ✅ |
| `GET` | `/api/payables` | Listar contas a pagar | ✅ |
| `POST` | `/api/payables` | Criar conta a pagar | ✅ |
| `PUT` | `/api/payables/{id}` | Atualizar conta a pagar | ✅ |
| `DELETE` | `/api/payables/{id}` | Remover conta a pagar | ✅ |
| `GET` | `/api/receivables` | Listar contas a receber | ✅ |
| `POST` | `/api/receivables` | Criar conta a receber | ✅ |
| `PUT` | `/api/receivables/{id}` | Atualizar conta a receber | ✅ |
| `DELETE` | `/api/receivables/{id}` | Remover conta a receber | ✅ |
| `POST` | `/api/open-finance/sync` | Sincronizar banco (mock) | ✅ |

---

## 🌱 Variáveis de Ambiente

Crie um arquivo `.env` e configure conforme necessário (os valores default estão no `docker-compose.yml`):

| Variável | Descrição | Default |
|---|---|---|
| `POSTGRES_USER` | Usuário do banco | `finflow_user` |
| `POSTGRES_PASSWORD` | Senha do banco | `finflow_password` |
| `POSTGRES_DB` | Nome do banco | `finflow_db` |
| `jwt.secret` | Chave secreta JWT (256 bits) | *(definido no application.yml)* |
| `jwt.expiration` | Expiração do token em ms | `86400000` (24h) |

---

## 🚢 Deploy

| Serviço | Plataforma |
|---|---|
| **Frontend** | [Vercel](https://vercel.com) |
| **Backend** | [Render](https://render.com) ou [Railway](https://railway.app) |
| **Banco de Dados** | [Neon](https://neon.tech) ou [Supabase](https://supabase.com) |

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

<div align="center">
  <p>Desenvolvido por <strong>Ronaldo</strong> | Portfólio Full Stack</p>
</div>
