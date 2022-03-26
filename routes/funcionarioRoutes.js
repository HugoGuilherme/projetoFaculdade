const express = require('express')
const router = express.Router()
const funcionarioController = require('../controllers/FuncionarioController')
const UserController = require('../controllers/UserController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', function (req, res) {
    res.render('areaFuncionario/funcionarioHome')
})

router.get('/dashboard/pedidos', function (req, res) {
    res.render('areaFuncionario/funcionarioPedidosDoCliente')
})

router.get('/dashboard/caixa', function (req, res) {
    res.render('areaFuncionario/funcionarioCaixa')
})

router.get('/dashboard/relatorios', function (req, res) {
    res.render('areaFuncionario/funcionarioRelatorios')
})

//Perfil funcionario
router.get('/dashboard/perfil', funcionarioController.atualizaFuncionarioPerfil)
router.post('/dashboard/atualizaFuncionarioPerfilPost', funcionarioController.atualizaFuncionarioPerfilPost)

//Clientes cadastrados
router.get('/dashboard/clientesCadastrados', funcionarioController.clientesCadastrados)
router.post('/dashboard/removeCliente/:id', funcionarioController.deletaCliente)
router.get('/dashboard/edit/:id', funcionarioController.atualizaCliente)
router.post('/dashboard/updateCliente', funcionarioController.atualizaClientetPost)

//Funcionarios cadastrados
router.get('/dashboard/funcionariosCadastrados', funcionarioController.funcionariosCadastrados)
router.post('/cadastrarUsuario', UserController.cadastrarUsuario)
router.get('/dashboard/editFuncionario/:id', funcionarioController.atualizaFuncionario)
router.post('/dashboard/updateFuncionario', funcionarioController.atualizaFuncionariotPost)
router.post('/dashboard/removeFuncionario/:id', funcionarioController.deletaFuncionario)

module.exports = router