const express = require('express')
const router = express.Router()
const RelatorioController = require('../controllers/RelatorioController')//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard/relatorios', checkAuth, RelatorioController.pedidosFinalizados)

module.exports = router