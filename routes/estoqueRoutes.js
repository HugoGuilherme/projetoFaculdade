const express = require('express')
const router = express.Router()
const EstoqueController = require('../controllers/EstoqueController')//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard/estoque', checkAuth, EstoqueController.estoqueCadastrado)

router.get('/dashboard/novoProduto', (req, res) => {
    res.render('./areaFuncionario/estoque/funcionarioNovoProduto')
})

router.post('/dashboard/cadastrarEstoque', checkAuth, EstoqueController.cadastrarEstoque)


module.exports = router