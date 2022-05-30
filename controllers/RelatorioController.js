const Cliente = require('../models/Cliente')
const Pedido = require("../models/Pedido")
const Estoque = require("../models/Estoque")
const session = require('express-session')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const sequelize = require('../db/conn')


module.exports = class RelatorioController {

    static async pedidosFinalizados(req, res) {
        var fromDate = Date.now()
        var fromDateYear = new Date(fromDate).getFullYear();
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1) < 10 ? '0' + (fromDateMonth.getMonth() + 1) : (fromDateMonth.getMonth() + 1);

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }
        const estoqueMensal = await Estoque.findAll({
            where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), fromMonth)
        })
        const estoqueAnual = await Estoque.findAll({
            where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), fromDateYear)
        })
        const estoquesCadastradosAnual = estoqueAnual.map(el => el.get({ plain: true }))
        const estoquesCadastradosMensalmente = estoqueMensal.map(el => el.get({ plain: true }))

        const pedido = await Pedido.findAll({
            include: Cliente,
            where: {
                ClienteId: { [Op.like]: `%${search}%` },
                statusPedidos: ['finalizado']
            }
        })
        const pedidosCadastrados = pedido.map(el => el.get({ plain: true }))
        res.render('areaFuncionario/funcionarioRelatorios', { pedidosCadastrados, estoquesCadastradosMensalmente, estoquesCadastradosAnual })

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