const express = require('express');
const router = express.Router();

const controller = require('../controllers/pessoaJuridicaController');
const { validarPessoaJuridica, validarId } = require('../middlewares/validators');

router.post('/', validarPessoaJuridica, controller.criar);
router.get('/', controller.listar);
router.get('/:id', validarId, controller.buscarPorId);
router.put('/:id', validarId, controller.atualizar);
router.delete('/:id', validarId, controller.remover);

module.exports = router;
