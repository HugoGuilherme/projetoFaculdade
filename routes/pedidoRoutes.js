const express = require('express')
const router = express.Router()
const PedidoController = require('../controllers/PedidoController')
//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.post('/pedido/realizado', checkAuth, PedidoController.cadastrarPedido)
router.get('/areaCliente/pedidos', checkAuth, PedidoController.pedidoCadastradoCliente)
router.get('/dashboard/pedidos', checkAuth, PedidoController.pedidosCadastrados)
router.post('/dashboard/removePedido/:id', checkAuth, PedidoController.deletaPedido)
router.get('/dashboard/editPedido/:id', checkAuth, PedidoController.editPedido)
router.post('/dashboard/updatePedido', checkAuth, PedidoController.updatePedido)
router.post('/dashboard/updatePedidoStatus', checkAuth, PedidoController.updatePedidoStatus)

module.exports = router