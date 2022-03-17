const express = require('express');
const exphbs = require("express-handlebars");
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const path = require("path")
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})
const app = express()

const conn = require('./db/conn')

//Models
const Cliente = require('./models/Cliente')
const Funcionario = require('./models/Funcionario')
const Pedido = require('./models/Pedido')
const Estoque = require('./models/Estoque')
const Movimentos = require('./models/Movimentos')
const Caixa = require('./models/Caixa')

//Import routes
const authRoutes = require('./routes/authRoutes')

//Template engine HBS
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))

//receber resposta do body
app.use(
    express.urlencoded({ extended: true })
)
app.use(express.json())

//Session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path:require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// flash messages
app.use(flash())

// set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

//Routes
app.use('/', authRoutes)

conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))


app.get('/', function (req, res) {
    res.render('home')
})