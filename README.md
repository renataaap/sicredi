# API de Cadastro (Pessoa Física / Pessoa Jurídica)

API REST em **Node.js + Express + MySQL2**, baseada no formulário de cadastro (aba PF/PJ).

## Estrutura

```
cadastro-api/
├── config/
│   └── db.js                 # Pool de conexões MySQL2
├── controllers/
│   ├── pessoaFisicaController.js
│   └── pessoaJuridicaController.js
├── models/
│   ├── pessoaFisicaModel.js
│   └── pessoaJuridicaModel.js
├── middlewares/
│   └── validators.js         # Validação com express-validator
├── routes/
│   ├── pessoaFisicaRoutes.js
│   └── pessoaJuridicaRoutes.js
├── sql/
│   └── schema.sql            # Script de criação do banco/tabelas
├── .env.example
├── package.json
└── server.js
```

## Como rodar

1. **Instalar dependências**
   ```bash
   cd cadastro-api
   npm install
   ```

2. **Criar o banco de dados**
   Rode o script `sql/schema.sql` no seu MySQL (ex: `mysql -u root -p < sql/schema.sql`).

3. **Configurar variáveis de ambiente**
   Copie `.env.example` para `.env` e ajuste usuário/senha/host do MySQL:
   ```bash
   cp .env.example .env
   ```

4. **Subir o servidor**
   ```bash
   npm run dev   # com nodemon, recarrega automaticamente
   # ou
   npm start
   ```

   A API sobe em `http://localhost:3000`.

## Endpoints

### Pessoa Física — `/api/pessoas-fisicas`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/` | Cria um cadastro PF |
| GET | `/` | Lista cadastros (`?limit=&offset=`) |
| GET | `/:id` | Busca um cadastro por ID |
| PUT | `/:id` | Atualiza um cadastro |
| DELETE | `/:id` | Remove um cadastro |

**Corpo do POST/PUT (JSON):**
```json
{
  "nome": "Maria da Silva",
  "cpf": "123.456.789-00",
  "data_nascimento": "1990-05-10",
  "sexo": "feminino",
  "documento": "MG-12.345.678",
  "telefone": "(11) 91234-5678",
  "email": "maria@email.com",
  "cep": "01310-100",
  "rua": "Av. Paulista",
  "numero": "1000",
  "complemento": "Apto 45",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "senha": "minhaSenha123"
}
```
> `senha` é opcional (só é usada se o cadastro tiver acesso ao sistema) e é armazenada com hash `bcrypt`. CPF e CEP podem vir formatados ou só com números — a API remove a formatação automaticamente.

### Pessoa Jurídica — `/api/pessoas-juridicas`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/` | Cria um cadastro PJ |
| GET | `/` | Lista cadastros (`?limit=&offset=`) |
| GET | `/:id` | Busca um cadastro por ID |
| PUT | `/:id` | Atualiza um cadastro |
| DELETE | `/:id` | Remove um cadastro |

**Corpo do POST/PUT (JSON):**
```json
{
  "razao_social": "Empresa Exemplo LTDA",
  "nome_fantasia": "Exemplo Store",
  "cnpj": "12.345.678/0001-90",
  "inscricao_estadual": "123456789",
  "data_abertura": "2015-03-20",
  "tipo_juridico": "LTDA",
  "cnae": "4711-3/02",
  "telefone": "(11) 3333-4444",
  "email": "contato@exemplo.com",
  "cep": "01310-100",
  "rua": "Av. Paulista",
  "numero": "1000",
  "complemento": "Sala 10",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "resp_nome": "João Souza",
  "resp_cpf": "123.456.789-00",
  "resp_cargo": "Diretor"
}
```

## Respostas de erro

- `422` — Falha de validação (campos obrigatórios/formatos inválidos), com detalhe em `erros`.
- `409` — CPF/CNPJ ou e-mail já cadastrado.
- `404` — Registro não encontrado.
- `500` — Erro interno.

## Próximos passos sugeridos

- Adicionar autenticação (JWT) para as rotas de PF que possuem senha.
- Validar CPF/CNPJ com dígito verificador (não só quantidade de dígitos).
- Adicionar testes automatizados (ex: Jest + Supertest).
- Adicionar paginação padronizada e filtros de busca (nome, cidade etc).
