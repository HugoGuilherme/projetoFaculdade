const Pedido = require("../models/Pedido")
const session = require('express-session')

module.exports = class PedidoController {

    static async cadastrarPedido(req, res){
        const {quantidadeDeGas, pagamento, valorTotal} = req.body

        const novoPedido = {statusPedidos: "pendente", quantidadePedido: quantidadeDeGas, tipoDePagamentoNaEntrega: pagamento, valorTotal: valorTotal, ClienteId: req.session.userid}

        const pedidoFeito = await Pedido.create(novoPedido)

        res.redirect(`/areaCliente/pedidos`)
    }

    static async pedidoCadastradoCliente(req, res) {
        const id = req.session.userid
        const pedido = await Pedido.findAll({where: {ClienteId: id}})
        const pedidoCadastrado = pedido.map((result) => result.dataValues)
        console.log(pedidoCadastrado);
        res.render('areaCliente/clientePedidos', { pedidoCadastrado })
    }

    static async pedidosCadastrados(req, res) {
        const pedido = await Pedido.findAll()
        const pedidosCadastrados = pedido.map((result) => result.dataValues)
        console.log(pedidosCadastrados);
        res.render('areaFuncionario/funcionarioPedidosDoCliente', { pedidosCadastrados })
        
    }

}