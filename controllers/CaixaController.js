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

        //valor estoque

        const valorNoEstoque = await Estoque.findAll({
            where: {
                createdAt: {
                    [Op.gt]: year + "-" + month + "-" + date
                }
            }
        })
        const resultadosvalorNoEstoque = valorNoEstoque.map((result) => result.dataValues.valorDoProduto)
        const resultadosquantidadeNoEstoque = valorNoEstoque.map((result) => result.dataValues.quantidadeArmazenada)
        var valorNoEstoqueResultado = 0;
        var ArmazenamentoNoEstoqueResultado = 0;

        function somarEstoque(item) {
            valorNoEstoqueResultado += parseInt(item);
        }
        function multiply(item) {
            ArmazenamentoNoEstoqueResultado += parseInt(item);
        }
        resultadosvalorNoEstoque.forEach(somarEstoque);
        resultadosquantidadeNoEstoque.forEach(multiply);

        //final valor estoque

        const pedidoFinalizado = await Pedido.findAll({
            where: {
                statusPedidos: ['finalizado'],
                createdAt: {
                    [Op.gt]: year + "-" + month + "-" + date
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
        var totalInseridoCaixa = valorNoEstoqueResultado * ArmazenamentoNoEstoqueResultado + total
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

    static atualizaCaixa(req, res) {
        const id = req.body.id

        const caixa = {
            id: req.body.id,
            valorAdicionado: req.body.valorAdicionado,
            valorRetirado: req.body.valorRetirado
        }
        Caixa.update(caixa, { where: { id: id } })
            .then(() => {
                return "OK";
                //res.redirect(`/dashboard/caixa`)
            })
            .catch((err) => console.log())
    }
}