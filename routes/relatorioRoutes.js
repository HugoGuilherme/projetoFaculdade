const express = require('express')
const router = express.Router()
const RelatorioController = require('../controllers/RelatorioController')//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard/relatorios', checkAuth, RelatorioController.pedidosFinalizados)
// router.get('/dashboard/estoque', checkAuth, EstoqueController.estoqueCadastrado)
// router.post('/dashboard/cadastrarEstoque', checkAuth, EstoqueController.cadastrarEstoque)
// router.get('/dashboard/editEstoque/:id', checkAuth, EstoqueController.editEstoque)
// router.post('/dashboard/updateEstoque', checkAuth, EstoqueController.updateEstoque)
// router.post('/dashboard/removeEstoque/:id', checkAuth, EstoqueController.removeEstoque)

module.exports = router