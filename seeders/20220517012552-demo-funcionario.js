'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('funcionarios', [{
      nome: 'adm',
      cpf: '14014192730',
      endereco: 'Rua A',
      dataDeNascimento: '1998-09-09',
      status: '3',
      email: 'adm@adm.com',
      senha: '$2a$10$PVYwQ7rFCv2ECv3gmcTObuyyBbn8xYsfqdlIJRUhEPNF6eGIpO.F.', // 123
      createdAt: '1992-09-19',
      updatedAt: '1998-09-19'

    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('funcionarios', null, {});

  }
};
