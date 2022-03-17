const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const Cliente = require('./Cliente')
const Funcionario = require('./Funcionario')
const Estoque = require('./Estoque')

const Pedido = db.define('Pedido', {
  // Model attributes are defined here
  statusPedidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidadePedido: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  valorTotal: {
    type: DataTypes.FLOAT
    // allowNull defaults to true
  },
  tipoDePagamentoNaEntrega: {
    type: DataTypes.DATEONLY
    // allowNull defaults to true
  },
  status: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
})

Pedido.belongsTo(Cliente)
Cliente.hasMany(Pedido)

Pedido.belongsTo(Funcionario)
Funcionario.hasMany(Pedido)

Pedido.belongsTo(Estoque)
Estoque.hasMany(Pedido)

module.exports = Pedido
