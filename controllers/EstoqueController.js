const Estoque = require('../models/Estoque')
const Pedido = require("../models/Pedido")
const { Op } = require("sequelize");

module.exports = class EstoqueController {
    static async estoqueCadastrado(req, res) {
        const estoque = await Estoque.findAll()
        const estoqueCadastrado = estoque.map((result) => result.dataValues)
        const quantidadeEstoqueVenda = estoque.map((result) => result.dataValues.quantidadeInserida)
        //valor estoque

        const valorPedidos = await Pedido.findAll({
            where: {
                statusPedidos: 'finalizado'
            }
        })
        const resultadosQuantidadePedidos = valorPedidos.map((result) => result.dataValues.quantidadePedido)
        var QuantidadeDePedidos = 0;
        var QuantidadeDeEstoque = 0;
        function somarPedidos(item) {
            QuantidadeDePedidos += parseInt(item);
        }

        function somarEstoque(item) {
            QuantidadeDeEstoque += parseInt(item);
        }


        resultadosQuantidadePedidos.forEach(somarPedidos)
        quantidadeEstoqueVenda.forEach(somarEstoque)

        const quantidadeRetirada = QuantidadeDeEstoque - QuantidadeDePedidos;
        res.render('areaFuncionario/estoque/funcionarioEstoque', { estoqueCadastrado, QuantidadeDeEstoque, quantidadeRetirada })
    }

    static async cadastrarEstoque(req, res) {
        const { nomeDoProduto, valorDoProduto, quantidadeInserida } = req.body

        const novoProduto = { nomeDoProduto, valorDoProduto, quantidadeInserida, data: new Date() }

        const produtoInserido = await Estoque.create(novoProduto)

        res.redirect(`/dashboard/estoque`)
    }

    static async removeEstoque(req, res) {
        const { id } = req.params
        try {
            await Estoque.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/estoque`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async editEstoque(req, res) {
        const { id } = req.params
        Estoque.findOne({ where: { id: id }, raw: true })
            .then((estoque) => {
                res.render('areaFuncionario/estoque/funcionarioEditaProduto', { estoque })
            })
            .catch((err) => console.log())
    }

    static updateEstoque(req, res) {
        const id = req.body.id

        const estoque = {
            id: req.body.id,
            nomeDoProduto: req.body.nomeDoProduto,
            valorDoProduto: req.body.valorDoProduto,
            quantidadeInserida: req.body.quantidadeInserida,
            data: new Date()
        }
        console.log(estoque);
        Estoque.update(estoque, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/estoque`)
            })
            .catch((err) => console.log())
    }
}