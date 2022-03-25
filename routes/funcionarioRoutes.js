const express = require('express')
const router = express.Router()
const funcionarioController = require('../controllers/FuncionarioController')
const UserController = require('../controllers/UserController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', function (req, res) {
    res.render('areaFuncionario/funcionarioHome')
})

router.get('/dashboard/pedidos', checkAuth, function (req, res) {
    res.render('areaFuncionario/funcionarioPedidosDoCliente')
})

router.get('/dashboard/caixa', checkAuth, function (req, res) {
    res.render('areaFuncionario/funcionarioCaixa')
})

router.get('/dashboard/relatorios', checkAuth, function (req, res) {
    res.render('areaFuncionario/funcionarioRelatorios')
})

//Perfil funcionario
router.get('/dashboard/perfil', checkAuth, funcionarioController.atualizaFuncionarioPerfil)
router.post('/dashboard/atualizaFuncionarioPerfilPost', funcionarioController.atualizaFuncionarioPerfilPost)

//Clientes cadastrados
router.get('/dashboard/clientesCadastrados', checkAuth, funcionarioController.clientesCadastrados)
router.post('/dashboard/removeCliente/:id', checkAuth, funcionarioController.deletaCliente)
router.get('/dashboard/edit/:id', checkAuth, funcionarioController.atualizaCliente)
router.post('/dashboard/updateCliente', checkAuth, funcionarioController.atualizaClientetPost)

//Funcionarios cadastrados
router.get('/dashboard/funcionariosCadastrados', checkAuth, funcionarioController.funcionariosCadastrados)
router.post('/cadastrarUsuario', UserController.cadastrarUsuario)
router.get('/dashboard/editFuncionario/:id', checkAuth, funcionarioController.atualizaFuncionario)
router.post('/dashboard/updateFuncionario', checkAuth, funcionarioController.atualizaFuncionariotPost)
router.post('/dashboard/removeFuncionario/:id', checkAuth, funcionarioController.deletaFuncionario)

module.exports = router