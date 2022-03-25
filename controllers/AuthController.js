const Cliente = require('../models/Cliente')

const bcrypt = require('bcryptjs')
const session = require('express-session')
const Funcionario = require('../models/Funcionario')

module.exports = class AuthController {
    static async acessoCliente(req, res) {
        const { email, senha } = req.body
        try {
            const cliente = await Cliente.findOne({ where: { email: email } })
            const funcionario = await Funcionario.findOne({ where: { email: email } })
            if (cliente) {
                const senhaCorreta = bcrypt.compareSync(senha, cliente.senha)
                if(cliente && senhaCorreta){
                    req.session.userid = cliente.id
                    req.session.status = cliente.status
                    console.log(cliente.status);
                    console.log(req.session);
                    req.session.save(() => {
                        res.redirect('./areaCliente/cliente')
                    })
                } else {
                    res.redirect('/')
                }
                
            } else if (funcionario) {
                const senhaFuncionarioCorreta = bcrypt.compareSync(senha, funcionario.senha)
                if (funcionario && senhaFuncionarioCorreta) {
                    req.session.userid = funcionario.id
                    req.session.status = funcionario.status
                    req.session.save(() => {
                        res.redirect('./dashboard')
                    })
                } else {
                    res.redirect('/')
                }
            } else {
                res.redirect('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }
}