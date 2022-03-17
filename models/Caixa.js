const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Pedido = require('./Pedido')
const Movimentos = require('./Movimentos')
const Estoque = require('./Estoque')
const Funcionario = require('./Funcionario')


const Caixa = db.define('Caixa', {
  // Model attributes are defined here
  valorAdicionado: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  valorRetirado: {
    type: DataTypes.FLOAT
    // allowNull defaults to true
  },
  valorTotal: {
    type: DataTypes.FLOAT
    // allowNull defaults to true
  },
  formaDePagamento: {
    type: DataTypes.FLOAT
    // allowNull defaults to true
  }
})

Caixa.belongsTo(Pedido)
Pedido.hasMany(Caixa)

Caixa.belongsTo(Movimentos)
Movimentos.hasMany(Caixa)

Caixa.belongsTo(Estoque)
Estoque.hasOne(Caixa)

Caixa.belongsTo(Funcionario)
Funcionario.hasMany(Caixa)

module.exports = Caixa
