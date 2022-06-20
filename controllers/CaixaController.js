const Caixa = require('../models/Caixa')
const Pedido = require("../models/Pedido")
const session = require('express-session')
const Clientes = require("../models/Cliente")
const Estoque = require("../models/Estoque")
const { Op } = require("sequelize");

module.exports = class CaixaController {

    static async pedidosEncaminhados(req, res) {

        var ts = Date.now();
        var date_ob = new Date(ts);
        var date = date_ob.getDate();
        var month = date_ob.getMonth() + 1;
        var year = date_ob.getFullYear();

        const pedidoFinalizado = await Pedido.findAll({
            where: {
                statusPedidos: ['finalizado'],
                data: {
                    [Op.eq]: year + "-" + month + "-" + date
                }
            }
        })

        const resultadosPedidosFinalizados = pedidoFinalizado.map((result) => result.dataValues.valorTotal)
        var total = 0;

        function somar(item) {
            total += parseInt(item);
        }
        resultadosPedidosFinalizados.forEach(somar);

        const pedido = await Pedido.findAll({
            include: Clientes,
            where: {
                statusPedidos: ['a caminho']
            }
        })
        var totalInseridoCaixa = total
        const pedidosCadastrados = pedido.map(el => el.get({ plain: true }))
        res.render('areaFuncionario/funcionarioCaixa', { pedidosCadastrados, totalInseridoCaixa })
    }

    static async finalizarPedidoCaixa(req, res) {
        const id = req.body.id
        const finalizaPedidoCaixa = {
            id: req.body.id,
            statusPedidos: "finalizado",
            quantidadePedido: req.body.quantidadePedido,
            valorTotal: req.body.totalAPagar
        }
        Pedido.update(finalizaPedidoCaixa, { where: { id: id } })
        //subindo pedido finalizado para atualizar a quantidade de botijões no estoque
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        const ultimoIdEstoque = ultimoEstoque.id
        const penultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']],
            offset: 1
        });
        if (penultimoEstoque) {
            const pedidoFinalizado = await Pedido.findAll({
                where: {
                    statusPedidos: ['finalizado'],
                    updatedAt: { [Op.gt]: penultimoEstoque.updatedAt }
                }
            })
            const quantidadeDePedidoFinalizado = pedidoFinalizado.map((result) => result.dataValues.quantidadePedido)
            var QuantidadeDePedidos = 0;
            function somarPedidos(item) {
                QuantidadeDePedidos += parseInt(item);
            }

            quantidadeDePedidoFinalizado.forEach(somarPedidos)
            const quantidadeRestante = ultimoEstoque.quantidadeInserida + penultimoEstoque.quantidadeArmazenada - QuantidadeDePedidos

            const vendasFinalizadas = {
                quantidadeVendida: QuantidadeDePedidos,
                quantidadeArmazenada: quantidadeRestante
            }
            Estoque.update(vendasFinalizadas, { where: { id: ultimoIdEstoque } })
                .then(() => {
                    res.redirect(`/dashboard/pedidosFinalizados`)
                })
                .catch((err) => console.log())
        } else {
            const pedidoFinalizado = await Pedido.findAll({
                where: {
                    statusPedidos: ['finalizado']
                }
            })
            const quantidadeDePedidoFinalizado = pedidoFinalizado.map((result) => result.dataValues.quantidadePedido)
            var QuantidadeDePedidos = 0;
            function somarPedidos(item) {
                QuantidadeDePedidos += parseInt(item);
            }

            quantidadeDePedidoFinalizado.forEach(somarPedidos)
            const quantidadeRestante = ultimoEstoque.quantidadeInserida - QuantidadeDePedidos

            const vendasFinalizadas = {
                quantidadeVendida: QuantidadeDePedidos,
                quantidadeArmazenada: quantidadeRestante
            }
            Estoque.update(vendasFinalizadas, { where: { id: ultimoIdEstoque } })
                .then(() => {
                    res.redirect(`/dashboard/pedidosFinalizados`)
                })
                .catch((err) => console.log())
        }


    }
    static async cancelarPedidoCaixa(req, res) {
        const id = req.body.id
        const finalizaPedidoCaixa = {
            id: req.body.id,
            statusPedidos: "cancelado"
        }
        console.log(finalizaPedidoCaixa);
        Pedido.update(finalizaPedidoCaixa, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/pedidosFinalizados`)
            })
            .catch((err) => console.log())
    }
    static async registroCaixa(req, res) {
        const registro = await Caixa.findAll()
        const registrosCadastrados = registro.map((result) => result.dataValues)
        console.log(registrosCadastrados);
        //res.render('areaFuncionario/pedidos/funcionarioPedidosDoCliente', { registrosCadastrados })   
    }
    static async editaCaixa(req, res) {
        const { id } = req.params
        Caixa.findOne({ where: { id: id }, raw: true })
            .then((registroCaixa) => {
                console.log(registroCaixa);
                // res.render('areaFuncionario/pedidos/funcionarioEditaPedido', { registroCaixa })
            })
            .catch((err) => console.log())
    }

    static async finalizaCaixa(req, res) {
        var ts = Date.now();
        var date_ob = new Date(ts);
        var date = date_ob.getDate();
        var month = date_ob.getMonth() + 1;
        var year = date_ob.getFullYear();
        const dataCompleta = year + "-" + month + "-" + date

        const valores = req.body

        const dataAtualBanco = await Caixa.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        })
        const dataAtualBancoDataValue = dataAtualBanco.map((result) => result.dataValues.createdAt)
        const idUltimaLinha = dataAtualBanco.map((result) => result.dataValues.id)
        var dateBD = dataAtualBancoDataValue[0].getDate();
        var monthBD = dataAtualBancoDataValue[0].getMonth() + 1;
        var yearBD = dataAtualBancoDataValue[0].getFullYear();
        const dataCompletaBD = yearBD + "-" + monthBD + "-" + dateBD

        console.log(idUltimaLinha[0]);
        if (dataCompleta === dataCompletaBD) {
            const valorAtualizado = Caixa.update(valores, { where: { id: idUltimaLinha[0] } })
            console.log(dataCompleta + " = " + dataCompletaBD);
            res.redirect(`/dashboard/caixa`)
        } else {
            const valorAdicionado = await Caixa.create(valores)
            console.log(dataCompleta + " != " + dataCompletaBD);
            res.redirect(`/dashboard/caixa`)
        }
    }


}