# 🌬️ DASHBOARD AIRSENSE (TCC)

Este repositório contém o código-fonte do projeto **AirSense**, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC).

O projeto é estruturado em duas partes principais:

* **Back-end:** API desenvolvida em Python utilizando Flask.
* **Front-end:** Dashboard desenvolvido em React + Vite.

---

## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de que sua máquina possui as seguintes ferramentas instaladas:

* [Python](https://www.python.org/) — versão 3 ou superior
* [Node.js](https://nodejs.org/) e npm
* [PostgreSQL](https://www.postgresql.org/) — serviço de banco de dados ativo na máquina

---

# ⚙️ 1. Configurando o Back-end (API)

O back-end é responsável por gerenciar a conexão com o banco de dados e fornecer as leituras para o dashboard.

### Passo 1 — Acesse a pasta do back-end

Abra um terminal na pasta raiz do projeto e execute:

```bash
cd backend
```

### Passo 2 — Crie o ambiente virtual

Este passo deve ser realizado apenas na primeira execução:

```bash
python -m venv venv
```

### Passo 3 — Ative o ambiente virtual

No **Windows (Prompt de Comando)**:

```cmd
venv\Scripts\activate
```

### Passo 4 — Instale as dependências

```bash
pip install -r requirements.txt
```

### Passo 5 — Configure a senha do PostgreSQL

Defina a variável de ambiente `DB_PASS` com a senha utilizada no PostgreSQL.

No **Windows (Prompt de Comando)**:

```cmd
set DB_PASS=sua_senha_aqui
```

> **Importante:** substitua `sua_senha_aqui` pela senha correta do seu banco de dados.

### Passo 6 — Inicie a API

```bash
python api.py
```

Após iniciar, o servidor da API ficará disponível em:

```text
http://localhost:5000
```

Mantenha este terminal aberto e o servidor rodando.

---

# 🖥️ 2. Configurando o Front-end (Dashboard)

O front-end consome os dados fornecidos pela API Flask e renderiza os gráficos e painéis do sistema.

### Passo 1 — Abra um novo terminal

Deixe o terminal do back-end aberto e rodando.

Em um novo terminal, navegue até a pasta do front-end:

```bash
cd frontend
```

### Passo 2 — Instale as dependências

Este passo deve ser realizado apenas na primeira execução:

```bash
npm install
```

### Passo 3 — Inicie o dashboard

```bash
npm run dev
```

### Passo 4 — Acesse o dashboard

Após executar o comando, o terminal exibirá o endereço de acesso.

Geralmente, o dashboard estará disponível em:

```text
http://localhost:5173
```

Abra o endereço exibido no terminal em seu navegador.

---

# 🧪 3. Como testar o envio de dados

Com o **back-end** e o **front-end** funcionando, é possível simular a chegada de novas informações provenientes do sensor de gás.

Abra um terminal na pasta `backend`, com o ambiente virtual ativado, e execute:

```bash
python teste_envio.py
```

O script irá simular o envio de novos dados.

Os dados serão:

1. Enviados para a API;
2. Gravados no banco de dados PostgreSQL;
3. Disponibilizados para o dashboard;
4. Atualizados automaticamente nos painéis da aplicação.

---

## 🚀 Estrutura básica do projeto

```text
AirSense/
│
├── backend/
│   ├── api.py
│   ├── teste_envio.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
│
└── README.md
```

---

## 📌 Resumo para execução

Para executar o projeto, é necessário manter **dois terminais ativos**:

**Terminal 1 — Back-end:**

```cmd
cd backend
venv\Scripts\activate
set DB_PASS=sua_senha_aqui
python api.py
```

**Terminal 2 — Front-end:**

```bash
cd frontend
npm install
npm run dev
```

Depois, acesse o endereço fornecido pelo Vite, normalmente:

```text
http://localhost:5173
```

Para testar o envio de dados:

```bash
cd backend
python teste_envio.py
```
