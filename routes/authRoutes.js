const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/logout', checkAuth, AuthController.logout)
router.post('/acessoUsuario', AuthController.acessoUsuario)

module.exports = router