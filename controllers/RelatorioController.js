const Cliente = require('../models/Cliente')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const Pedido = require("../models/Pedido")
const { Op } = require('sequelize')


module.exports = class RelatorioController {

    static async pedidosFinalizados(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        const pedido = await Pedido.findAll({
            include: Cliente,
            where: {
                ClienteId: { [Op.like]: `%${search}%` },
                statusPedidos: ['finalizado']
            }
        })
        const pedidosCadastrados = pedido.map(el => el.get({ plain: true }))
        res.render('areaFuncionario/funcionarioRelatorios', { pedidosCadastrados })

    }

    // static atualizaClientetPost(req, res) {
    //     const id = req.session.userid
    //     // create a password
    //     const salt = bcrypt.genSaltSync(10)
    //     const hashedPassword = bcrypt.hashSync(req.body.senha, salt)

    //     const cliente = {
    //         id: req.body.id,
    //         nome: req.body.nome,
    //         email: req.body.email,
    //         dataDeNascimento: req.body.dataDeNascimento,
    //         senha: hashedPassword,
    //         endereco: req.body.endereco
    //     }

    //     Cliente.update(cliente, { where: { id: id } })
    //         .then(() => {
    //             res.redirect(`/areaCliente/perfil`)
    //         })
    //         .catch((err) => console.log())
    // }
}