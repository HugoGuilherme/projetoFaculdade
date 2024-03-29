const Cliente = require('../models/Cliente')
const Funcionario = require('../models/Funcionario')
const session = require('express-session')
const bcrypt = require('bcryptjs')

module.exports = class UserController {
    static async cadastrarUsuario(req, res) {
        const { nome, sobrenome, cpf, status, dataDeNascimento, email, senha, cep, numeroCasa, rua, bairro, cidade, uf } = req.body
        const endereco = `${rua}, ${numeroCasa} - ${bairro} - ${cidade} - ${uf} - ${cep}`

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(senha, salt)

        const usuario = {
            nome: nome + ' ' + sobrenome, cpf, dataDeNascimento,
            email, endereco, status, senha: hashedPassword
        }

        try {
            var validador = await Cliente.findOne({ where: { email: email } })
            console.log(validador);
            if (validador) {
                res.redirect('./')
            } else {
                try {
                    if (status == 1) {
                        const clienteCriado = await Cliente.create(usuario)
                        //iniciando sessão
                        req.session.userid = clienteCriado.id
                        req.session.status = clienteCriado.status
                        req.session.save(() => {
                            res.redirect('/areaCliente/cliente')
                        })
                    } else {
                        const funcionarioCriado = await Funcionario.create(usuario)
                        res.redirect('/dashboard/funcionariosCadastrados')
                        
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error)
        }        
    }
}