const pool = require('../config/db');

const CAMPOS = [
  'razao_social', 'nome_fantasia', 'cnpj', 'inscricao_estadual', 'data_abertura',
  'tipo_juridico', 'cnae', 'telefone', 'email', 'cep', 'rua', 'numero',
  'complemento', 'bairro', 'cidade', 'estado', 'resp_nome', 'resp_cpf', 'resp_cargo'
];

async function criar(dados) {
  const [result] = await pool.query(
    `INSERT INTO pessoa_juridica
      (razao_social, nome_fantasia, cnpj, inscricao_estadual, data_abertura,
       tipo_juridico, cnae, telefone, email, cep, rua, numero, complemento,
       bairro, cidade, estado, resp_nome, resp_cpf, resp_cargo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.razao_social, dados.nome_fantasia || null, dados.cnpj,
      dados.inscricao_estadual || null, dados.data_abertura || null,
      dados.tipo_juridico || null, dados.cnae || null, dados.telefone || null,
      dados.email || null, dados.cep || null, dados.rua || null, dados.numero || null,
      dados.complemento || null, dados.bairro || null, dados.cidade || null,
      dados.estado || null, dados.resp_nome || null, dados.resp_cpf || null,
      dados.resp_cargo || null
    ]
  );
  return result.insertId;
}

async function listar({ limit = 20, offset = 0 } = {}) {
  const [rows] = await pool.query(
    `SELECT * FROM pessoa_juridica ORDER BY id DESC LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM pessoa_juridica WHERE id = ?', [id]);
  return rows[0] || null;
}

async function buscarPorCnpj(cnpj) {
  const [rows] = await pool.query('SELECT id FROM pessoa_juridica WHERE cnpj = ?', [cnpj]);
  return rows[0] || null;
}

async function atualizar(id, dados) {
  const campos = CAMPOS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0) return false;

  const setClause = campos.map((c) => `${c} = ?`).join(', ');
  const valores = campos.map((c) => dados[c]);

  const [result] = await pool.query(
    `UPDATE pessoa_juridica SET ${setClause} WHERE id = ?`,
    [...valores, id]
  );
  return result.affectedRows > 0;
}

async function remover(id) {
  const [result] = await pool.query('DELETE FROM pessoa_juridica WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { criar, listar, buscarPorId, buscarPorCnpj, atualizar, remover };
