const Cliente = require('../models/Cliente')
const session = require('express-session')
const bcrypt = require('bcryptjs')

module.exports = class ClienteController {

    static async atualizaCliente(req, res) {
        console.log(req.session);
        const id = req.session.userid
        Cliente.findOne({ where: { id: id }, raw: true })
            .then((cliente) => {
                res.render('areaCliente/clientePerfil', { cliente })
            })
            .catch((err) => console.log())
    }

    static atualizaClientetPost(req, res) {
        const id = req.session.userid

        const cliente = {
            id: req.body.id,
            nome: req.body.nome,
            email: req.body.email,
            dataDeNascimento: req.body.dataDeNascimento,
            senha: req.body.senha,
            endereco: req.body.endereco
        }

        Cliente.update(cliente, { where: { id: id } })
            .then(() => {
                res.redirect(`/areaCliente/perfil`)
            })
            .catch((err) => console.log())
    }
}