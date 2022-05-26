const Estoque = require('../models/Estoque')
const Pedido = require("../models/Pedido")
const { Op } = require("sequelize");

module.exports = class EstoqueController {
    static async estoqueCadastrado(req, res) {
        const estoque = await Estoque.findAll()
        const estoqueCadastrado = estoque.map((result) => result.dataValues)
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        if (ultimoEstoque) {
            const ultimoEstoqueQuantidadeInserida = ultimoEstoque.quantidadeInserida
            const ultimoEstoqueQuantidadeTotal = ultimoEstoque.quantidadeArmazenada
            const penultimoEstoque = await Estoque.findOne({
                order: [['createdAt', 'DESC']],
                offset: 1
            });

            res.render('areaFuncionario/estoque/funcionarioEstoque', { estoqueCadastrado, ultimoEstoqueQuantidadeInserida, ultimoEstoqueQuantidadeTotal })
        } else {
            req.flash('mensagemEstoqueVazio', 'Estoque vazio, por favor cadastre botijões')
            res.render('areaFuncionario/estoque/funcionarioEstoque', { estoqueCadastrado })
        }

    }

    static async cadastrarEstoque(req, res) {
        const { nomeDoProduto, valorDoProduto, quantidadeInserida } = req.body
        const ultimoEstoque = await Estoque.findOne({
            order: [['createdAt', 'DESC']]
        });
        if (ultimoEstoque) {

            const valorArmazenadoPenultimo = ultimoEstoque.quantidadeArmazenada
            const valorArmazenadoAnteriorMaisONovo = parseInt(valorArmazenadoPenultimo) + parseInt(quantidadeInserida)
            const novoProduto = { nomeDoProduto, valorDoProduto, quantidadeInserida: quantidadeInserida, quantidadeArmazenada: valorArmazenadoAnteriorMaisONovo, data: new Date() }
            const produtoInserido = await Estoque.create(novoProduto)

            res.redirect(`/dashboard/estoque`)
        } else {
            const novoProduto = { nomeDoProduto, valorDoProduto, quantidadeInserida: quantidadeInserida, quantidadeArmazenada: quantidadeInserida, data: new Date() }
            const produtoInserido = await Estoque.create(novoProduto)

            res.redirect(`/dashboard/estoque`)

        }

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
        Estoque.update(estoque, { where: { id: id } })
            .then(() => {
                res.redirect(`/dashboard/estoque`)
            })
            .catch((err) => console.log())
    }
}