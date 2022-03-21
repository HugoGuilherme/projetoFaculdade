const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/ClienteController')
const UserController = require('../controllers/UserController')

router.get('/areaCliente/cliente', (req, res)=> {
    res.render('./areaCliente/cliente')
})
router.get('/areaCliente/perfil',  clienteController.atualizaCliente)
router.get('/areaCliente/pedidos', (req, res)=> {
    res.render('./areaCliente/clientePedidos')
})

router.post('/cadastrarCliente', UserController.cadastrarUsuario)
router.post('/cliente/updateCliente', clienteController.atualizaClientetPost)

module.exports= router