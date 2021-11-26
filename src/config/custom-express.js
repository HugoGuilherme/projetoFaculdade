const express = require('express');
const app = express();

app.use(express.static(__dirname + './../../public'));
app.use(express.static(__dirname + './../../view'));


module.exports = app;