require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pessoaFisicaRoutes = require('./routes/pessoaFisicaRoutes');
const pessoaJuridicaRoutes = require('./routes/pessoaJuridicaRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/', (req, res) => {
  res.json({ sucesso: true, mensagem: 'API de Cadastro no ar 🚀' });
});

// Rotas
app.use('/api/pessoas-fisicas', pessoaFisicaRoutes);
app.use('/api/pessoas-juridicas', pessoaJuridicaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada.' });
});

// Tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
