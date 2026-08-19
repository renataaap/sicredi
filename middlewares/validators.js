const { body, param, validationResult } = require('express-validator');

function tratarErros(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(422).json({ sucesso: false, erros: erros.array() });
  }
  next();
}

// Remove tudo que não for dígito (útil para validar CPF/CNPJ)
const soDigitos = (v) => (v || '').replace(/\D/g, '');

const validarPessoaFisica = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 150 }),
  body('cpf')
    .customSanitizer(soDigitos)
    .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos'),
  body('data_nascimento').optional({ nullable: true }).isISO8601().withMessage('Data de nascimento inválida'),
  body('sexo').optional({ nullable: true }).isIn(['feminino', 'masculino', 'outro', 'nao_informar']),
  body('email').optional({ nullable: true }).isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('telefone').optional({ nullable: true }).isLength({ max: 20 }),
  body('estado').optional({ nullable: true }).isLength({ min: 2, max: 2 }),
  body('cep').optional({ nullable: true }).customSanitizer(soDigitos).isLength({ min: 8, max: 8 }),
  body('senha').optional({ nullable: true }).isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
  tratarErros
];

const validarPessoaJuridica = [
  body('razao_social').trim().notEmpty().withMessage('Razão social é obrigatória').isLength({ max: 150 }),
  body('cnpj')
    .customSanitizer(soDigitos)
    .isLength({ min: 14, max: 14 }).withMessage('CNPJ deve ter 14 dígitos'),
  body('data_abertura').optional({ nullable: true }).isISO8601().withMessage('Data de abertura inválida'),
  body('tipo_juridico').optional({ nullable: true }).isIn(['MEI', 'LTDA', 'EIRELI', 'S/A', 'Outro']),
  body('email').optional({ nullable: true }).isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('telefone').optional({ nullable: true }).isLength({ max: 20 }),
  body('estado').optional({ nullable: true }).isLength({ min: 2, max: 2 }),
  body('cep').optional({ nullable: true }).customSanitizer(soDigitos).isLength({ min: 8, max: 8 }),
  body('resp_cpf').optional({ nullable: true }).customSanitizer(soDigitos).isLength({ min: 11, max: 11 }),
  tratarErros
];

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  tratarErros
];

module.exports = { validarPessoaFisica, validarPessoaJuridica, validarId, soDigitos };
