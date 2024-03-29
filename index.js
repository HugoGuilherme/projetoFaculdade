const express = require('express')
const exphbs = require("express-handlebars")
const moment = require('moment')
const handlebars = require('handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const path = require("path")
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})
const app = express()

const conn = require('./db/conn')

//Import routes
const authRoutes = require('./routes/authRoutes')
const clienteRoutes = require('./routes/clienteRoutes')
const funcionarioRoutes = require('./routes/funcionarioRoutes')
const estoqueRoutes = require('./routes/estoqueRoutes')
const pedidoRoutes = require('./routes/pedidoRoutes')
const caixaRoutes = require('./routes/caixaRoutes')
const relatorioRoutes = require('./routes/relatorioRoutes')
const backupRoutes = require('./routes/backupRoutes')

//Configura a função formatDate
//Template engine HBS
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
// flash messages
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

//receber resposta do body
app.use(
    express.urlencoded({ extended: true })
)
app.use(express.json())

handlebars.registerHelper('ifCond', function (value, options) {
    if (value == 3) {
        return options.fn(this);
    } else
        return options.inverse(this);
})

handlebars.registerHelper('formatDate', function (value) {
    return moment(value).format('DD/MM/YYYY')
})

handlebars.registerHelper('valorGas', function (value) {
    return value * 100
})

handlebars.registerHelper('valorCompra', function (value1, value2) {
    return value1 * value2
})

handlebars.registerHelper('switch', function (value, options) {
    this.switch_value = value;
    return options.fn(this);
});

handlebars.registerHelper('case', function (value, options) {
    if (value == this.switch_value) {
        return options.fn(this);
    }
});

//Session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 3600000000000000,
            expires: new Date(Date.now() + 360000000000000),
            httpOnly: true
        }
    })
)
const Cliente = require('./models/Cliente')
const Funcionario = require('./models/Funcionario')
const Pedido = require('./models/Pedido')
const Estoque = require('./models/Estoque')
const Movimentos = require('./models/Movimentos')
const Caixa = require('./models/Caixa')


// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

//Routes
app.use('/', authRoutes)
app.use('/', clienteRoutes)
app.use('/', funcionarioRoutes)
app.use('/', estoqueRoutes)
app.use('/', pedidoRoutes)
app.use('/', caixaRoutes)
app.use('/', relatorioRoutes)
app.use('/', backupRoutes)

conn
    // aqui vai o código do servidor {force: true}
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))


app.get('/', function (req, res) {
    res.render('home')
})