const Caixa = require('../models/Caixa')

module.exports = class CaixaController {
    static async cadastraRegistroCaixa(req, res){
        const {valorAdicionado, valorRetirado} = req.body
        const novoRegistro = {valorAdicionado, valorRetirado}
        const registroCadastrado = await Caixa.create(novoRegistro)
        console.log(registroCadastrado);
        //res.redirect(`/areaCliente/pedidos`)
    }
    static async registroUnicoCaixa(req, res) {
        const id = req.session.userid
        const registro = await Caixa.findAll({where: {id: id}})
        const registroCadastrado = registro.map((result) => result.dataValues)
        console.log(registroCadastrado);
        //res.render('areaCliente/clientePedidos', { registroCadastrado })
    }
    static async registroCaixa(req, res) {
        const registro = await Caixa.findAll()
        const registrosCadastrados = registro.map((result) => result.dataValues)
        console.log(registrosCadastrados);
        //res.render('areaFuncionario/pedidos/funcionarioPedidosDoCliente', { registrosCadastrados })   
    }
    static async deletaRegistroCaixa(req, res) {
        const { id } = req.params
        try {
            await Caixa.destroy({ where: { id: Number(id) } })
            //res.redirect(`/dashboard/pedidos`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
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

    static  atualizaCaixa(req, res) {
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