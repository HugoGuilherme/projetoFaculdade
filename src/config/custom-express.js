require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();

app.use(express.static(__dirname + './../../public'));
app.use(express.static(__dirname + './../../view'));

const rotas = require('../app/rotas/rotas.js');
rotas(app);

module.exports = app;