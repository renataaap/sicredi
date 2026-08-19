const pool = require('../config/db');

const CAMPOS = [
  'nome', 'cpf', 'data_nascimento', 'sexo', 'documento',
  'telefone', 'email', 'cep', 'rua', 'numero', 'complemento',
  'bairro', 'cidade', 'estado'
];

async function criar(dados, senhaHash) {
  const [result] = await pool.query(
    `INSERT INTO pessoa_fisica
      (nome, cpf, data_nascimento, sexo, documento, telefone, email,
       cep, rua, numero, complemento, bairro, cidade, estado, senha_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.nome, dados.cpf, dados.data_nascimento || null, dados.sexo || null,
      dados.documento || null, dados.telefone || null, dados.email || null,
      dados.cep || null, dados.rua || null, dados.numero || null,
      dados.complemento || null, dados.bairro || null, dados.cidade || null,
      dados.estado || null, senhaHash || null
    ]
  );
  return result.insertId;
}

async function listar({ limit = 20, offset = 0 } = {}) {
  const [rows] = await pool.query(
    `SELECT id, nome, cpf, data_nascimento, sexo, documento, telefone, email,
            cep, rua, numero, complemento, bairro, cidade, estado, criado_em, atualizado_em
     FROM pessoa_fisica
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    `SELECT id, nome, cpf, data_nascimento, sexo, documento, telefone, email,
            cep, rua, numero, complemento, bairro, cidade, estado, criado_em, atualizado_em
     FROM pessoa_fisica WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function buscarPorCpf(cpf) {
  const [rows] = await pool.query('SELECT id FROM pessoa_fisica WHERE cpf = ?', [cpf]);
  return rows[0] || null;
}

async function atualizar(id, dados) {
  const campos = CAMPOS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0) return false;

  const setClause = campos.map((c) => `${c} = ?`).join(', ');
  const valores = campos.map((c) => dados[c]);

  const [result] = await pool.query(
    `UPDATE pessoa_fisica SET ${setClause} WHERE id = ?`,
    [...valores, id]
  );
  return result.affectedRows > 0;
}

async function remover(id) {
  const [result] = await pool.query('DELETE FROM pessoa_fisica WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { criar, listar, buscarPorId, buscarPorCpf, atualizar, remover };
