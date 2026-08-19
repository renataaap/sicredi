const model = require('../models/pessoaJuridicaModel');
const { soDigitos } = require('../middlewares/validators');

async function criar(req, res) {
  try {
    const dados = {
      ...req.body,
      cnpj: soDigitos(req.body.cnpj),
      cep: soDigitos(req.body.cep),
      resp_cpf: req.body.resp_cpf ? soDigitos(req.body.resp_cpf) : null
    };

    const existente = await model.buscarPorCnpj(dados.cnpj);
    if (existente) {
      return res.status(409).json({ sucesso: false, mensagem: 'CNPJ já cadastrado.' });
    }

    const id = await model.criar(dados);
    const registro = await model.buscarPorId(id);

    return res.status(201).json({ sucesso: true, dados: registro });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ sucesso: false, mensagem: 'CNPJ ou e-mail já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar pessoa jurídica.' });
  }
}

async function listar(req, res) {
  try {
    const { limit, offset } = req.query;
    const registros = await model.listar({ limit, offset });
    return res.json({ sucesso: true, dados: registros });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pessoas jurídicas.' });
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
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar pessoa jurídica.' });
  }
}

async function atualizar(req, res) {
  try {
    const dados = { ...req.body };
    if (dados.cnpj) dados.cnpj = soDigitos(dados.cnpj);
    if (dados.cep) dados.cep = soDigitos(dados.cep);
    if (dados.resp_cpf) dados.resp_cpf = soDigitos(dados.resp_cpf);

    const atualizado = await model.atualizar(req.params.id, dados);
    if (!atualizado) {
      return res.status(404).json({ sucesso: false, mensagem: 'Registro não encontrado ou nada para atualizar.' });
    }
    const registro = await model.buscarPorId(req.params.id);
    return res.json({ sucesso: true, dados: registro });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ sucesso: false, mensagem: 'CNPJ ou e-mail já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pessoa jurídica.' });
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
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover pessoa jurídica.' });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, remover };
