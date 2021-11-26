const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/view'));

app.listen(3000, () => {
    console.log("rota 3000 rodando");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/funcionario', (req, res) => {
    res.sendFile(__dirname + '/view/funcionario.html')
});
app.get('/cliente', (req, res) => {
    res.sendFile(__dirname + '/view/cliente.html')
});