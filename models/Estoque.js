const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Funcionario = require('./Funcionario')

const Estoque = db.define('Estoque', {
  // Model attributes are defined here
  nomeDoProduto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valorDoProduto: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  quantidade: {
    type: DataTypes.INTEGER
    // allowNull defaults to true
  }
});

Estoque.belongsTo(Funcionario)
Funcionario.hasOne(Estoque)

module.exports = Estoque
