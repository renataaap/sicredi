const bcrypt = require('bcrypt');
const model = require('../models/pessoaFisicaModel');
const { soDigitos } = require('../middlewares/validators');

async function criar(req, res) {
  try {
    const dados = { ...req.body, cpf: soDigitos(req.body.cpf), cep: soDigitos(req.body.cep) };

    const existente = await model.buscarPorCpf(dados.cpf);
    if (existente) {
      return res.status(409).json({ sucesso: false, mensagem: 'CPF já cadastrado.' });
    }

    let senhaHash = null;
    if (req.body.senha) {
      senhaHash = await bcrypt.hash(req.body.senha, 10);
    }

    const id = await model.criar(dados, senhaHash);
    const registro = await model.buscarPorId(id);

    return res.status(201).json({ sucesso: true, dados: registro });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ sucesso: false, mensagem: 'CPF ou e-mail já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar pessoa física.' });
  }
}

async function listar(req, res) {
  try {
    const { limit, offset } = req.query;
    const registros = await model.listar({ limit, offset });
    return res.json({ sucesso: true, dados: registros });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pessoas físicas.' });
  }
}

async function buscarPorId(req, res) {
  try {
    const registro = await model.buscarPorId(req.params.id);
    if (!registro) {
      return res.status(404).json({ sucesso: false, mensagem: 'Registro não encontrado.' });
    }
    return res.json({ sucesso: true, dados: registro });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar pessoa física.' });
  }
}

async function atualizar(req, res) {
  try {
    const dados = { ...req.body };
    if (dados.cpf) dados.cpf = soDigitos(dados.cpf);
    if (dados.cep) dados.cep = soDigitos(dados.cep);
    delete dados.senha; // senha é tratada separadamente, se necessário

    const atualizado = await model.atualizar(req.params.id, dados);
    if (!atualizado) {
      return res.status(404).json({ sucesso: false, mensagem: 'Registro não encontrado ou nada para atualizar.' });
    }
    const registro = await model.buscarPorId(req.params.id);
    return res.json({ sucesso: true, dados: registro });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ sucesso: false, mensagem: 'CPF ou e-mail já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pessoa física.' });
  }
}

async function remover(req, res) {
  try {
    const removido = await model.remover(req.params.id);
    if (!removido) {
      return res.status(404).json({ sucesso: false, mensagem: 'Registro não encontrado.' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover pessoa física.' });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, remover };
