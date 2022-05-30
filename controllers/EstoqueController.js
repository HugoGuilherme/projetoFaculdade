const Estoque = require('../models/Estoque')
const Pedido = require("../models/Pedido")
const { Op } = require("sequelize");

module.exports = class EstoqueController {
    static async pedidoDeCompraDeProdutos(req, res) {
        const estoque = await Estoque.findAll({ order: [['data', 'DESC']] })
        const estoqueCadastrado = estoque.map((result) => result.dataValues)
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        if (ultimoEstoque) {
            const valorTotalInserido = estoque.map((result) => result.dataValues.valorTotal)
            const totalInserido = estoque.map((result) => result.dataValues.quantidadeInserida)
            var quantidadeTotalInserida = 0;
            var valorTotalComprada = 0;

            function somarEstoque(item) {
                quantidadeTotalInserida += parseInt(item);
            }
            function somarValor(item) {
                valorTotalComprada += parseInt(item);
            }
            totalInserido.forEach(somarEstoque);
            valorTotalInserido.forEach(somarValor)

            res.render('areaFuncionario/pedidoDeCompra/funcionarioPedidoDeCompra', { estoqueCadastrado, quantidadeTotalInserida, valorTotalComprada })
        } else {
            req.flash('mensagemEstoqueVazio', 'Estoque vazio, por favor cadastre botijões')
            res.render('areaFuncionario/pedidoDeCompra/funcionarioPedidoDeCompra', { estoqueCadastrado })
        }

    }

    static async cadastrarCompra(req, res) {
        const { nomeDoProduto, valorDoProduto, quantidadeInserida } = req.body
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        if (ultimoEstoque) {

            const valorArmazenadoPenultimo = ultimoEstoque.quantidadeArmazenada
            const valorArmazenadoAnteriorMaisONovo = parseInt(valorArmazenadoPenultimo) + parseInt(quantidadeInserida)
            const valorTotalInserido = parseInt(valorDoProduto) * parseInt(quantidadeInserida)

            const novoProduto = { nomeDoProduto, valorDoProduto, quantidadeInserida: quantidadeInserida, quantidadeArmazenada: valorArmazenadoAnteriorMaisONovo, valorTotal: valorTotalInserido, data: new Date() }
            const produtoInserido = await Estoque.create(novoProduto)

            res.redirect(`/dashboard/pedidoDeCompra`)
        } else {
            const valorTotalInserido = parseInt(valorDoProduto) * parseInt(quantidadeInserida)
            const novoProduto = { nomeDoProduto, valorDoProduto, quantidadeInserida: quantidadeInserida, quantidadeArmazenada: quantidadeInserida, valorTotal: valorTotalInserido, data: new Date() }

            const produtoInserido = await Estoque.create(novoProduto)

            res.redirect(`/dashboard/pedidoDeCompra`)

        }

    }

    static async removeCompra(req, res) {
        const { id } = req.params
        try {
            await Estoque.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/pedidoDeCompra`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async editCompra(req, res) {
        const { id } = req.params
        Estoque.findOne({ where: { id: id }, raw: true })
            .then((estoque) => {
                res.render('areaFuncionario/estoque/funcionarioEditaProduto', { estoque })
            })
            .catch((err) => console.log())
    }

    static updateCompra(req, res) {
        const id = req.body.id

        const estoque = {
            id: req.body.id,
            nomeDoProduto: req.body.nomeDoProduto,
            valorDoProduto: req.body.valorDoProduto,
            quantidadeInserida: req.body.quantidadeInserida,
            data: new Date()
        }
        Estoque.update(estoque, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/pedidoDeCompra`)
            })
            .catch((err) => console.log())
    }

    static async estoque(req, res) {
        const estoque = await Estoque.findAll({ order: [['data', 'DESC']] })
        const estoqueCadastrado = estoque.map((result) => result.dataValues)
        res.render('areaFuncionario/estoque/estoque', { estoqueCadastrado })
    }
}