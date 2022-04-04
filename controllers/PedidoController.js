const Pedido = require("../models/Pedido")
const session = require('express-session')
const Clientes = require("../models/Cliente")

module.exports = class PedidoController {

    static async cadastrarPedido(req, res){
        const {quantidadeDeGas, pagamento, valorTotal} = req.body

        const novoPedido = {statusPedidos: "pendente", quantidadePedido: quantidadeDeGas, tipoDePagamentoNaEntrega: pagamento, valorTotal: valorTotal, ClienteId: req.session.userid}

        const pedidoFeito = await Pedido.create(novoPedido)

        res.redirect(`/areaCliente/pedidos`)
    }

    static async pedidoCadastradoCliente(req, res) {
        const id = req.session.userid
        const pedido = await Pedido.findAll({
            where: {ClienteId: id},
            include: Clientes
        })
        const pedidoCadastrado = pedido.map(el => el.get({plain: true}))
        console.log(pedidoCadastrado);
        res.render('areaCliente/clientePedidos', { pedidoCadastrado })
    }

    static async pedidosCadastrados(req, res) {
        const pedido = await Pedido.findAll({include:Clientes})            
        const pedidosCadastrados = pedido.map(el => el.get({plain: true}))
        res.render('areaFuncionario/pedidos/funcionarioPedidosDoCliente', { pedidosCadastrados })
        
    }

    static async deletaPedido(req, res) {
        const { id } = req.params
        try {
            await Pedido.destroy({ where: { id: Number(id) } })
            res.redirect(`/dashboard/pedidos`)
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

    static  updatePedido(req, res) {
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
}