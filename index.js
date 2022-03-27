const express = require('express');
const exphbs = require("express-handlebars");
const handlebars = require('handlebars');
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

//Template engine HBS
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
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
});

handlebars.registerHelper('switch', function (value, options) {
    this.switch_value = value;
    return options.fn(this);
});

handlebars.registerHelper('case', function (value, options) {
    if (value == this.switch_value) {
        return options.fn(this);
    }
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
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
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

// flash messages
app.use(flash())

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

conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))


app.get('/', function (req, res) {
    res.render('home')
})