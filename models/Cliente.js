const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Cliente = db.define('Cliente', {
  // Model attributes are defined here
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  endereco: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  dataDeNascimento: {
    type: DataTypes.DATEONLY
    // allowNull defaults to true
  },
  status: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  email: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  senha: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
});

module.exports = Cliente
