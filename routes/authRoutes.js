const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')


router.get('/logout', AuthController.logout)
router.post('/acessoCliente', AuthController.acessoCliente)

module.exports = router