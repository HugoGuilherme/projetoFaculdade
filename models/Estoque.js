const { DataTypes } = require('sequelize')

const db = require('../db/conn')

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
  },
  data:{
    type: DataTypes.DATE
  }
});

module.exports = Estoque
