module.exports = (app) => {
    app.get('/', (req, res) => {
        res.marko(
            require('../../../index.marko')
        )
    });
    
    app.get('/funcionario', (req, res) => {
        res.marko(
            require('../../../public/view/funcionario.marko')
        )
    });
    app.get('/cliente', (req, res) => {
        res.marko(
            require('../../../public/view/cliente.marko')
        )
    });
}

