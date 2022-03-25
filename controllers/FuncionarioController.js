const Funcionario = require('../models/Funcionario')
const Cliente = require('../models/Cliente')
const bcrypt = require('bcryptjs')
module.exports = class FuncionarioController {

    static async atualizaFuncionarioPerfil(req, res) {
        const id = req.session.userid
        Funcionario.findOne({ where: { id: id }, raw: true })
        .then((funcionario) => {
            res.render('areaFuncionario/funcionarioPerfil', { funcionario })
        })
        .catch((err) => console.log())
    }

    static atualizaFuncionarioPerfilPost(req, res) {
        const id = req.session.userid

        const funcionario = {
            id: req.body.id,
            nome: req.body.nome,
            email: req.body.email,
            dataDeNascimento: req.body.dataDeNascimento,
            senha: req.body.senha,
            endereco: req.body.endereco
        }

        Funcionario.update(funcionario, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/perfil`)
            })
            .catch((err) => console.log())
    }

    
    static async clientesCadastrados(req, res) {
        const clientes = await Cliente.findAll()
        const clientesCadastrados = clientes.map((result) => result.dataValues)
        res.render('areaFuncionario/funcionarioCadastroClientes', { clientesCadastrados })
    }

    static async deletaCliente(req, res) {
        const { id } = req.params
        try {
            await Cliente.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/clientesCadastrados`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async atualizaCliente(req, res) {
        const { id } = req.params
        Cliente.findOne({ where: { id: id }, raw: true })
            .then((clienteCadastrado) => {
                res.render('areaFuncionario/funcionarioCadastroCliente', { clienteCadastrado })
            })
            .catch((err) => console.log())
    }

    static atualizaClientetPost(req, res) {
        const id = req.body.id
        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.senha, salt)

        const cliente = {
            id: req.body.id,
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            senha: hashedPassword,
            endereco: req.body.endereco
        }

        Cliente.update(cliente, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/clientesCadastrados`)
            })
            .catch((err) => console.log())
    }

    
    static async funcionariosCadastrados(req, res) {
        const funcionarios = await Funcionario.findAll()
        const funcionariosCadastrados = funcionarios.map((result) => result.dataValues)
        res.render('areaFuncionario/funcionariosCadastrados', { funcionariosCadastrados })
    }

    static async atualizaFuncionario(req, res) {
        const { id } = req.params
        Funcionario.findOne({ where: { id: id }, raw: true })
            .then((funcionarioCadastrado) => {
                res.render('areaFuncionario/funcionarioAtualizacao', { funcionarioCadastrado })
            })
            .catch((err) => console.log())
    }
    
    static atualizaFuncionariotPost(req, res) {
        const id = req.body.id

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.senha, salt)

        const funcionario = {
            id: req.body.id,
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            senha: hashedPassword,
            endereco: req.body.endereco
        }

        Funcionario.update(funcionario, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/funcionariosCadastrados`)
            })
            .catch((err) => console.log())
    }

    static async deletaFuncionario(req, res) {
        const { id } = req.params
        try {
            await Funcionario.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/funcionariosCadastrados`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}