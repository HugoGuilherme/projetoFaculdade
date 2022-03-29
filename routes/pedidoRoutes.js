const express = require('express')
const router = express.Router()
const PedidoController = require('../controllers/PedidoController')
//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.post('/pedido/realizado', checkAuth, PedidoController.cadastrarPedido)
router.get('/areaCliente/pedidos', checkAuth, PedidoController.pedidoCadastradoCliente)
router.get('/dashboard/pedidos', checkAuth, PedidoController.pedidosCadastrados)

module.exports = router