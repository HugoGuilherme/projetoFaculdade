const Estoque = require('../models/Estoque')

module.exports = class EstoqueController {
    static async estoqueCadastrado(req, res) {
        const estoque = await Estoque.findAll()
        const estoqueCadastrado = estoque.map((result) => result.dataValues)
        res.render('areaFuncionario/estoque/funcionarioEstoque', { estoqueCadastrado })
    }

    static async cadastrarEstoque(req, res){
        const {nomeDoProduto, valorDoProduto, quantidade} = req.body

        const novoProduto = {nomeDoProduto, valorDoProduto, quantidade, data: new Date()}

        const produtoInserido = await Estoque.create(novoProduto)

        res.redirect(`/dashboard/estoque`)
    }
}