const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/ClienteController')
const UserController = require('../controllers/UserController')
//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/areaCliente/cliente', checkAuth, (req, res) => {
    res.render('./areaCliente/cliente')
})

router.post('/cadastrarCliente', UserController.cadastrarUsuario)
router.get('/areaCliente/perfil', checkAuth, clienteController.atualizaCliente)
router.post('/cliente/updateCliente', checkAuth, clienteController.atualizaClientetPost)


module.exports = router