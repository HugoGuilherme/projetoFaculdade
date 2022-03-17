const Cliente = require('../models/Cliente')

const bcrypt = require('bcryptjs')
const session = require('express-session')

module. exports = class AuthController{

    static async cadastrarCliente(req, res){
        const {nome, sobrenome, cpf, dataDeNascimento, email, senha, confirmpassword, cep, numeroCasa, rua, bairro, cidade, uf} = req.body
        const endereco = `${rua}, ${numeroCasa} - ${bairro} - ${cidade} - ${uf} - ${cep}`
        

        // password match validation
        if(senha != confirmpassword){
            //mensagem
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('home')
            return
        }

        const verificaClienteExistente = await Cliente.findOne({where: {email: email}})

        if(verificaClienteExistente){
            req.flash('message', 'O email ja esta em uso, tente outro!')
            res.render('home')
            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(senha, salt)

        const cliente = {
            nome, sobrenome, cpf, dataDeNascimento,
            email, endereco,
            senha: hashedPassword
        }
        try {
            const clienteCriado = await Cliente.create(cliente)

            //iniciando sessão
            req.session.userid = clienteCriado.id

            req.session.save(() => {
                res.redirect('./areaCliente/cliente')
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async acessoCliente(req, res){
        const {email, senha} = req.body
        //achar usuario
        const cliente = await Cliente.findOne({where: {email: email}})

        if(!cliente){
            req.flash('message', 'Email incorreto')
            res.render('home')
            return
        }
        //verificar se a senha esta certa
        const senhaCorreta = bcrypt.compareSync(senha, cliente.senha)

        if(!senhaCorreta){
            req.flash('message', 'Senha incorreta')
            res.render('home')
            return
        }
        console.log(email, senha, cliente.id)
        req.session.userid = cliente.id

        req.session.save(() => {
            res.redirect('./areaCliente/cliente')
        })
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }
}