const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require("path")
const mysql = require('mysql')
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.use(
    express.urlencoded({ extended: true })
)

app.use(express.json())

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', function (req, res) {
    res.render('home')
})

app.post('/novoUsuario', (req, res) => {

    const nome = req.body.nome
    const sobrenome = req.body.sobrenome
    const cpf = req.body.cpf
    const dataDeNascimento = req.body.dataDeNascimento
    const email = req.body.email
    const senha = req.body.senha
    const cep = req.body.cep
    const numeroCasa = req.body.numeroCasa
    const rua = req.body.rua
    const bairro = req.body.bairro
    const cidade = req.body.cidade
    const uf = req.body.uf

    var nomeCompleto = nome + " " + sobrenome;
    var enderecoCompleto = `${rua}, ${numeroCasa} - ${bairro} - ${cidade}/${uf} - ${cep}`;


    const insert = `INSERT INTO cliente (nome, cpf, endereco, dataDeNascimento, status, email, senha) VALUES ('${nomeCompleto}', '${cpf}', '${enderecoCompleto}', '${dataDeNascimento}', 'cliente' , '${email}', '${senha}')`

    conn.query(insert, function (err) {
        if (err) {
            console.log(err)
        }
    })
    res.redirect('/')

})

app.get('/funcionario', function (req, res) {
    res.render('areaFuncionario/funcionarioHome')
})

app.get('/funcionario/perfil', function (req, res) {
    res.render('areaFuncionario/funcionarioPerfil')
})

app.get('/funcionario/pedidos', function (req, res) {
    res.render('areaFuncionario/funcionarioPedidosDoCliente')
})
app.get('/funcionario/clientesCadastrados', function (req, res) {
    const selectQuery = "SELECT * FROM cliente"

    conn.query(selectQuery, function (err, data) {
        if (err) {
            console.log(err)
        }
        const pessoas = data
        res.render('areaFuncionario/funcionarioCadastroClientes', { pessoas })
    })
})
app.post('/funcionario/removeCliente/:id', function (req, res) {
    const id = req.params.id
    const query = `DELETE FROM cliente WHERE idCliente = ${id}`

    conn.query(query, function (err) {
        if (err) {
            console.log(err)
        }

        res.redirect(`/funcionario/clientesCadastrados`)
    })
})

app.get('/funcionario/edit/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM cliente WHERE idCliente = ${id}`

    conn.query(query, function (err, data) {
        if (err) {
            console.log(err)
        }

        const pessoa = data[0]

        console.log(data[0])

        res.render('areaFuncionario/funcionarioCadastroCliente', { pessoa })
    })
})

app.post('/funcionario/updateCliente', function (req, res) {
    const id = req.body.id
    const nome = req.body.nome
    const cpf = req.body.cpf
    const dataDeNascimento = req.body.dataDeNascimento
    const email = req.body.email
    const senha = req.body.senha
    const endereco = req.body.endereco

    console.log(id, nome, email, senha, endereco);

    const query = `UPDATE cliente SET nome = '${nome}', cpf = '${cpf}', endereco = '${endereco}', dataDeNascimento = '${dataDeNascimento}', email = '${email}', senha = '${senha}'  WHERE idCliente = ${id}`

    conn.query(query, function (err) {
        if (err) {
            console.log(err)
        }

        res.redirect(`/funcionario/clientesCadastrados`)
    })
})

app.get('/funcionario/caixa', function (req, res) {
    res.render('areaFuncionario/funcionarioCaixa')
})

app.get('/funcionario/relatorios', function (req, res) {
    res.render('areaFuncionario/funcionarioRelatorios')
})

app.get('/cliente/:id', function (req, res) {
    id = req.params.id  
    res.render('areaCliente/cliente', {id})
    
})

app.get('/cliente/:id/perfil', function (req, res) {
    id = req.params.id  

    const query = `SELECT * FROM cliente WHERE idCliente = ${id}`

    
    conn.query(query, function (err, data) {
        if (err) {
            console.log(err)
        }

        const pessoa = data[0]

        console.log(data[0])

        res.render('areaCliente/clientePerfil', {id, pessoa })
    })
})
app.get('/cliente/:id/pedidos', function (req, res) {
    const pedidos = [{
        quantidade: 1,
        endereco: "Rua nova, 400",
        valor: "R$ 35,00"
    }, {
        quantidade: 2,
        endereco: "Rua nova, 200",
        valor: "R$ 45,00"
    }
    ]
    id = req.params.id  
    res.render('areaCliente/clientePedidos', { id })
})

app.post('/acessoCliente', (req, res) => {

    try {
        let email = req.body.email
        const queryEmail = `SELECT email FROM cliente WHERE email = '${email}'`
        conn.query(queryEmail, function (err, data) {
            const senha = req.body.password
            const queryEmailToId = `SELECT idCliente FROM cliente WHERE email = '${email}'`
            if (email == undefined || email == null || email == '' || data == '') {
                res.redirect('/')
            } else {
                conn.query(queryEmailToId, function (err, data) {
                    const idPessoa = data
                    const idPessoaValue = Object.values(idPessoa.find(element => element = "id")).find(element => element)
                    const queryIdToSenha = `SELECT senha FROM cliente WHERE idCliente = '${idPessoaValue}'`

                    conn.query(queryIdToSenha, function (err, data) {
                        const senhaPessoa = data
                        if(data == ''){
                            res.redirect('/')
                        }else{
                            const senhaPessoaValue = (Object.values(senhaPessoa.find(element => element = "senha")).find(element => element))
                            if (senha == senhaPessoaValue) {
                                res.redirect('/cliente/' + idPessoaValue)
                            } else {
                                console.log(senha + " != " + senhaPessoaValue)
                                res.redirect('/')
                            }
                        }
                    })
                })
            }
        })

    } catch (error) {
        console.log(error)
    }

})

//conexão banco de dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projetofaculdade'
})
conn.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("conectado no MYSQL")
    app.listen(3000)
})