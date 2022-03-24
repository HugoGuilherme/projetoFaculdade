const Cliente = require('../models/Cliente')
const Funcionario = require('../models/Funcionario')
const session = require('express-session')
const bcrypt = require('bcryptjs')

module.exports = class UserController {
    static async cadastrarUsuario(req, res) {
        const { nome, sobrenome, cpf, status, dataDeNascimento, email, senha,  cep, numeroCasa, rua, bairro, cidade, uf } = req.body
        const endereco = `${rua}, ${numeroCasa} - ${bairro} - ${cidade} - ${uf} - ${cep}`

        try {
            var validador = await Cliente.findOne({ where: { email: email } })
            if (validador)
                res.render('home')
        } catch (error) {
            console.log(error)
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(senha, salt)

        const usuario = {
            nome: nome + ' ' + sobrenome, cpf, dataDeNascimento,
            email, endereco, status, senha: hashedPassword
        }

        try {
            if (status == 1) {
                const clienteCriado = await Cliente.create(usuario)

                //iniciando sessão
                req.session.userid = clienteCriado.id

                req.session.save(() => {
                    res.redirect('./areaCliente/cliente')
                })
            } else {
                const funcionarioCriado = await Funcionario.create(usuario)

                //iniciando sessão
                req.session.userid = funcionarioCriado.id

                req.session.save(() => {
                    res.redirect('./dashboard/funcionariosCadastrados')
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}