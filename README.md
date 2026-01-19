# 🚗 Locadora - Sistema de Gestão de Aluguéis (Full Stack)

Bem-vindo ao repositório unificado da **Locadora**. Este projeto é uma solução completa para gerenciamento de locações, integrando uma API robusta e uma interface moderna e responsiva.

## 🚀 Tecnologias e Versões

Este projeto utiliza as seguintes tecnologias de ponta para garantir performance e escalabilidade:

- **Backend:** Java 21 com Spring Boot (Maven)
- **Frontend:** Vue.js 3 com Framework Quasar
- **Banco de Dados:** PostgreSQL 15
- **Infraestrutura:** Docker & Docker Compose

## 🛠️ Como Executar o Projeto

A forma mais simples e recomendada de rodar o ambiente completo é utilizando o Docker. Certifique-se de ter o Docker e o Docker Compose instalados.

Na raiz do projeto (`Locadora-fullstack`), execute:

```bash
docker-compose up -d --build
```

Este comando irá baixar as imagens, compilar o código e subir todos os serviços necessários automaticamente.

## 🌐 Portas de Acesso

Após a inicialização, você poderá acessar o sistema através dos seguintes endereços:

- **Frontend (Web):** [http://localhost:80](http://localhost:80)
- **Backend (API):** [http://localhost:8080](http://localhost:8080)
- **Banco de Dados:** Porta 5432 (PostgreSQL)

## 📋 Principais Tecnologias (Tech Stack)

### **Backend**
- **Spring Data JPA:** Persistência de dados simplificada.
- **Spring Security & JWT:** Autenticação e autorização segura.
- **PostgreSQL:** Banco de dados relacional robusto.
- **Maven:** Gerenciamento de dependências.

### **Frontend**
- **Quasar Framework:** UI components de alta performance.
- **Vue-i18n:** Suporte a múltiplos idiomas.
- **Axios:** Integração com a API.
- **Vite:** Build tool ultrarrápido.

---
*Este projeto foi unificado em um Monorepo para facilitar o processo de desenvolvimento e implantação.*
