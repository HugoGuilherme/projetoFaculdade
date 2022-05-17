const Funcionario = require('../models/Funcionario')
const Cliente = require('../models/Cliente')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
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
        let search = ''

        if (req.query.search) {
            search = req.query.search
        }
        const clientes = await Cliente.findAll({
            where: {
                nome: { [Op.like]: `%${search}%` }
            }
        })
        const clientesCadastrados = clientes.map((result) => result.dataValues)
        res.render('areaFuncionario/clienteCRUD/funcionarioRegistroClientes', { clientesCadastrados })
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
                res.render('areaFuncionario/clienteCRUD/funcionarioCadastroCliente', { clienteCadastrado })
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
        let search = ''

        if (req.query.search) {
            search = req.query.search
        }
        const funcionarios = await Funcionario.findAll({
            where: {
                nome: { [Op.like]: `%${search}%` }
            }
        })
        const funcionariosCadastrados = funcionarios.map((result) => result.dataValues)
        res.render('areaFuncionario/funcionarioCRUD/funcionariosCadastrados', { funcionariosCadastrados })
    }

    static async atualizaFuncionario(req, res) {
        const { id } = req.params
        Funcionario.findOne({ where: { id: id }, raw: true })
            .then((funcionarioCadastrado) => {
                res.render('areaFuncionario/funcionarioCRUD/funcionarioAtualizacao', { funcionarioCadastrado })
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