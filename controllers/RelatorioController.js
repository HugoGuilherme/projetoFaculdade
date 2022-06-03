const Cliente = require('../models/Cliente')
const Pedido = require("../models/Pedido")
const Estoque = require("../models/Estoque")
const session = require('express-session')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const sequelize = require('../db/conn')


module.exports = class RelatorioController {

    static async pedidosFinalizados(req, res) {
        var fromDate = Date.now()
        var fromDateYear = new Date(fromDate).getFullYear();
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1);

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }


        const diaDoMesOndeComprouMais = await sequelize.query("SELECT createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques where Month(createdAt) = " + fromMonth + " GROUP BY MONTH(createdAt)")
        var diaDosMesesOndeComprouMais = await sequelize.query("SELECT MONTHNAME(createdAt) as MONTH, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques GROUP BY MONTH(createdAt)")
        diaDosMesesOndeComprouMais = diaDosMesesOndeComprouMais[0]
        var anosOndeComprouMais = await sequelize.query("SELECT YEAR(createdAt) as YEAR, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques GROUP BY YEAR(createdAt)")
        anosOndeComprouMais = anosOndeComprouMais[0]


        var somaTotalDoMes = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTHNAME(e.createdAt) as mes from estoques e where month(e.createdAt) = " + fromMonth + "  group by month(e.createdAt)")
        somaTotalDoMes = (somaTotalDoMes[0]);
        var somaTotalDosMeses = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTHNAME(e.createdAt) as mes from estoques e group by month(e.createdAt)")
        somaTotalDosMeses = (somaTotalDosMeses[0]);
        var somaTotalDosAnos = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, YEAR(e.createdAt) as mes from estoques e group by YEAR(e.createdAt)")
        somaTotalDosAnos = (somaTotalDosAnos[0]);

        res.render('areaFuncionario/funcionarioRelatorios', { diaDoMesOndeComprouMais, diaDosMesesOndeComprouMais, anosOndeComprouMais, somaTotalDoMes, somaTotalDosMeses, somaTotalDosAnos })

    }

    // static atualizaClientetPost(req, res) {
    //     const id = req.session.userid
    //     // create a password
    //     const salt = bcrypt.genSaltSync(10)
    //     const hashedPassword = bcrypt.hashSync(req.body.senha, salt)

    //     const cliente = {
    //         id: req.body.id,
    //         nome: req.body.nome,
    //         email: req.body.email,
    //         dataDeNascimento: req.body.dataDeNascimento,
    //         senha: hashedPassword,
    //         endereco: req.body.endereco
    //     }

    //     Cliente.update(cliente, { where: { id: id } })
    //         .then(() => {
    //             res.redirect(`/areaCliente/perfil`)
    //         })
    //         .catch((err) => console.log())
    // }
}