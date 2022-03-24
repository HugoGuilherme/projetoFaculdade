const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const Caixa = require('./Caixa')

const Movimentos = db.define('Movimentos', {
  // Model attributes are defined here
  hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT
    // allowNull defaults to true
  }
})

Movimentos.belongsTo(Caixa)
Caixa.hasMany(Movimentos)

module.exports = Movimentos
