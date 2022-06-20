'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Clientes', [{
      nome: 'cliente',
      cpf: '14014192730',
      endereco: 'Rua A',
      dataDeNascimento: '1998-09-09',
      status: '1',
      email: 'cliente@cliente.com',
      senha: '$2a$10$PVYwQ7rFCv2ECv3gmcTObuyyBbn8xYsfqdlIJRUhEPNF6eGIpO.F.',
      createdAt: '1992-09-19',
      updatedAt: '1998-09-19'

    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Clientes', null, {});

  }
};
