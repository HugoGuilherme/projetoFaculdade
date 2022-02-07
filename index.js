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


    const insert = `INSERT INTO pessoa (nome, email, senha, endereco) VALUES ('${nomeCompleto}', '${email}', '${senha}', '${enderecoCompleto}')`

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
    const selectQuery = "SELECT * FROM pessoa"

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
    const query = `DELETE FROM pessoa WHERE id = ${id}`

    conn.query(query, function (err) {
        if (err) {
            console.log(err)
        }

        res.redirect(`/funcionario/clientesCadastrados`)
    })
})

app.get('/funcionario/edit/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM pessoa WHERE id = ${id}`

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
    const email = req.body.email
    const senha = req.body.senha
    const endereco = req.body.endereco

    console.log(id, nome, email, senha, endereco);

    const query = `UPDATE pessoa SET nome = '${nome}', email = '${email}', senha = '${senha}', endereco = '${endereco}' WHERE id = ${id}`

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

app.get('/cliente/', function (req, res) {
    res.render('areaCliente/cliente')
})

app.get('/cliente/perfil', function (req, res) {
    res.render('areaCliente/clientePerfil')
})
app.get('/cliente/pedidos', function (req, res) {
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
    res.render('areaCliente/clientePedidos', { pedidos })
})

app.post('/acessoCliente', (req, res) => {

    const email = req.body.email
    const senha = req.body.password
    if (!email) {
        res.redirect('/')
    } else {
        const queryEmailToId = `SELECT id FROM pessoa WHERE email = '${email}'`

        conn.query(queryEmailToId, function (err, data) {
            const idPessoa = data
            const idPessoaValue = Object.values(idPessoa.find(element => element = "id")).find(element => element)
            const queryIdToSenha = `SELECT senha FROM pessoa WHERE id = ${idPessoaValue}`
            conn.query(queryIdToSenha, function (err, data) {
                const senhaPessoa = data
                const senhaPessoaValue = (Object.values(senhaPessoa.find(element => element = "senha")).find(element => element))
                if (email && senha == senhaPessoaValue) {
                    console.log(`Olá ${email}, seja bem vindo`)
                    res.redirect('/cliente')
                } else {
                    console.log("erro")
                    res.redirect('/')
                }
            })
        })
    }
})

//conexão banco de dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})
conn.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("conectado no MYSQL")
    app.listen(3000)
})