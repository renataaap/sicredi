const express = require('express');
const router = express.Router();

const controller = require('../controllers/pessoaFisicaController');
const { validarPessoaFisica, validarId } = require('../middlewares/validators');

router.post('/', validarPessoaFisica, controller.criar);
router.get('/', controller.listar);
router.get('/:id', validarId, controller.buscarPorId);
router.put('/:id', validarId, controller.atualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
