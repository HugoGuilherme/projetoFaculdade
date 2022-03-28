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

    static  updateEstoque(req, res) {
        const id = req.body.id
        
        const estoque = {
            id: req.body.id,
            nomeDoProduto: req.body.nomeDoProduto,
            valorDoProduto: req.body.valorDoProduto,
            quantidade: req.body.quantidade,
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