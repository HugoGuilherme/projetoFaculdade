const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/areaCliente/cliente', (req, res)=> {
    res.render('./areaCliente/cliente')
})
router.get('/areaCliente/perfil', (req, res)=> {
    res.render('./areaCliente/clientePerfil')
})
router.get('/areaCliente/pedidos', (req, res)=> {
    res.render('./areaCliente/clientePedidos')
})
router.get('/logout', AuthController.logout)
router.post('/acessoCliente', AuthController.acessoCliente)
router.post('/cadastrarCliente', AuthController.cadastrarCliente)

module.exports= router