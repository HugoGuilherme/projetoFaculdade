const Pedido = require("../models/Pedido")
const Clientes = require("../models/Cliente")
const session = require('express-session')
const Estoque = require('../models/Estoque')

const { Op } = require('sequelize')

module.exports = class PedidoController {

    static async cadastrarPedido(req, res) {
        const { quantidadeDeGas, pagamento, valorTotal, troco } = req.body

        const novoPedido = { statusPedidos: "pendente", troco: troco, quantidadePedido: quantidadeDeGas, tipoDePagamentoNaEntrega: pagamento, valorTotal: valorTotal, ClienteId: req.session.userid, data: new Date() }
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        if (ultimoEstoque == null) {
            req.flash('mensagemFaltandoBotijao', 'Estamos sem produtos no estoque, logo teremos <3')
            res.render('areaCliente/cliente')
            return
        } else if (ultimoEstoque.quantidadeArmazenada > 0) {
            const pedidoFeito = await Pedido.create(novoPedido)
        } else {
            req.flash('mensagemFaltandoBotijao', 'Estamos sem produtos no estoque, logo teremos <3')
            res.render('areaCliente/cliente')
            console.log("Estamos sem produtos no estoque, logo teremos <3");
            return
        }

        res.redirect(`/areaCliente/pedidos`)
    }

    static async pedidoCadastradoCliente(req, res) {
        const id = req.session.userid
        const pedido = await Pedido.findAll({
            where: { ClienteId: id },
            order: [['createdAt', 'DESC']],
            include: Clientes
        })
        const pedidoCadastrado = pedido.map(el => el.get({ plain: true }))
        console.log(pedidoCadastrado);
        res.render('areaCliente/clientePedidos', { pedidoCadastrado })
    }

    static async pedidosCadastrados(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        const pedido = await Pedido.findAll({
            include: Clientes,
            where: {
                id: { [Op.like]: `%${search}%` },
                statusPedidos: ['pendente', 'confirmado']
            }
        })
        const pedidosCadastrados = pedido.map(el => el.get({ plain: true }))
        res.render('areaFuncionario/pedidos/funcionarioPedidosDoCliente', { pedidosCadastrados })

    }

    static async pedidosFinalizados(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        const pedido = await Pedido.findAll({
            include: Clientes,
            where: {
                id: { [Op.like]: `%${search}%` },
                statusPedidos: ['finalizado', 'cancelado']
            }
        })
        const pedidosCadastrados = pedido.map(el => el.get({ plain: true }))
        res.render('areaFuncionario/pedidos/funcionarioPedidosFinalizadosDoCliente', { pedidosCadastrados })

    }

    static async deletaPedido(req, res) {
        const { id } = req.params
        try {
            await Pedido.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/pedidosFinalizados`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async editPedido(req, res) {
        const { id } = req.params
        Pedido.findOne({ where: { id: id }, raw: true })
            .then((pedido) => {
                res.render('areaFuncionario/pedidos/funcionarioEditaPedido', { pedido })
            })
            .catch((err) => console.log())
    }

    static updatePedido(req, res) {
        const id = req.body.id

        const pedido = {
            id: req.body.id,
            tipoDePagamentoNaEntrega: req.body.tipoDePagamentoNaEntrega,
            valorTotal: req.body.valorTotal,
            quantidadePedido: req.body.quantidadePedido,
            statusPedidos: req.body.statusPedidos
        }
        Pedido.update(pedido, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/pedidos`)
            })
            .catch((err) => console.log())
    }
    static updatePedidoStatus(req, res) {
        const id = req.body.id
        console.log(req.body.statusDoPedido);
        const pedido = {
            statusPedidos: req.body.statusDoPedido,
            FuncionarioId: req.session.userid
        }
        Pedido.update(pedido, { where: { id: id } })
            .then(() => {
                if (req.body.statusDoPedido == "a caminho") {
                    res.redirect(`/dashboard/caixa`)
                } else {
                    res.redirect(`/dashboard/pedidos`)
                }
            })
            .catch((err) => console.log())
    }
}