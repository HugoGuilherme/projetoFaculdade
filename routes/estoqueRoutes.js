const express = require('express')
const router = express.Router()
const EstoqueController = require('../controllers/EstoqueController')//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard/novoProduto', (req, res) => {
    res.render('./areaFuncionario/pedidoDeCompra/funcionarioNovoProduto')
})
router.get('/dashboard/pedidoDeCompra', checkAuth, EstoqueController.pedidoDeCompraDeProdutos)
router.post('/dashboard/cadastrarCompra', checkAuth, EstoqueController.cadastrarCompra)
router.get('/dashboard/editCompra/:id', checkAuth, EstoqueController.editCompra)
router.post('/dashboard/updateCompra', checkAuth, EstoqueController.updateCompra)
router.post('/dashboard/removeCompra/:id', checkAuth, EstoqueController.removeCompra)

router.get('/dashboard/estoque', checkAuth, EstoqueController.estoque)

module.exports = router