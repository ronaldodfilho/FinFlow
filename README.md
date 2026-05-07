# FinFlow

FinFlow é um Sistema Financeiro Full Stack Moderno inspirado em plataformas como Nubank, Stripe e Inter. Ele fornece um ERP financeiro completo com dashboard, contas a pagar e receber, histórico de transações e uma simulação de Open Finance.

## Tecnologias

- **Frontend:** React, Vite, TailwindCSS, Zustand, Recharts, Axios.
- **Backend:** Java, Spring Boot, Spring Data JPA, Spring Security (JWT), PostgreSQL.
- **Infraestrutura:** Docker, Docker Compose.

## Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Java 17+ (ou superior)
- Node.js 18+ e npm

### Passo a Passo

1. Subir o Banco de Dados (PostgreSQL)
```bash
docker-compose up -d
```

2. Executar o Backend
Navegue até a pasta `backend` e rode:
```bash
cd backend
./mvnw spring-boot:run
```
O backend estará disponível em `http://localhost:8080`.
Documentação Swagger: `http://localhost:8080/swagger-ui.html`.

3. Executar o Frontend
Navegue até a pasta `frontend`, instale as dependências e inicie o projeto:
```bash
cd frontend
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:5173`.
