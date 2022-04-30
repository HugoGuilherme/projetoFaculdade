const express = require('express')
const router = express.Router()
const CaixaController = require('../controllers/CaixaController')
//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard/caixa', checkAuth, CaixaController.pedidosEncaminhados)

router.post('/caixa/pedidoFinalizado', checkAuth, CaixaController.finalizarPedidoCaixa)
router.get('/areaCliente/pedidos', checkAuth, CaixaController.registroUnicoCaixa)
router.get('/dashboard/pedidos', checkAuth, CaixaController.registroCaixa)
router.post('/dashboard/removePedido/:id', checkAuth, CaixaController.deletaRegistroCaixa)
router.get('/dashboard/editPedido/:id', checkAuth, CaixaController.editaCaixa)
router.post('/dashboard/updatePedido', checkAuth, CaixaController.atualizaCaixa)

module.exports = router