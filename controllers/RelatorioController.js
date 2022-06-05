const Cliente = require('../models/Cliente')
const Pedido = require("../models/Pedido")
const Estoque = require("../models/Estoque")
const session = require('express-session')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const sequelize = require('../db/conn')
var http = require('http');
var fs = require('fs');
const PDFDocument = require("pdfkit-table");
var path = require('path');

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
        var download = function (url, dest, cb) {
            var file = fs.createWriteStream(dest);
            var request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(cb);  // close() is async, call cb after close completes.
                });
            }).on('error', function (err) { // Handle errors
                fs.unlink(dest); // Delete the file async. (But we don't check the result)
                if (cb) cb(err.message);
            });
        };

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

    static async EnviarRelatorio(req, res) {
        var fromDate = Date.now()
        var fromDateYear = new Date(fromDate).getFullYear();
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1);

        const diaDoMesOndeComprouMais = await sequelize.query("SELECT date_format(createdAt, '%d/%m/%Y') as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques where Month(createdAt) = " + fromMonth + " GROUP BY MONTH(createdAt)")
        var diaDosMesesOndeComprouMais = await sequelize.query("SELECT MONTHNAME(createdAt) as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques GROUP BY MONTH(createdAt)")
        diaDosMesesOndeComprouMais = diaDosMesesOndeComprouMais[0]
        var anosOndeComprouMais = await sequelize.query("SELECT YEAR(createdAt) as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  estoques GROUP BY YEAR(createdAt)")
        anosOndeComprouMais = anosOndeComprouMais[0]

        var somaTotalDoMes = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTHNAME(e.createdAt) as mes from estoques e where month(e.createdAt) = " + fromMonth + "  group by month(e.createdAt)")
        somaTotalDoMes = (somaTotalDoMes[0]);
        var somaTotalDosMeses = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTHNAME(e.createdAt) as mes from estoques e group by month(e.createdAt)")
        somaTotalDosMeses = (somaTotalDosMeses[0]);
        var somaTotalDosAnos = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, YEAR(e.createdAt) as mes from estoques e group by YEAR(e.createdAt)")
        somaTotalDosAnos = (somaTotalDosAnos[0]);

        var estoque = await Estoque.findAll()
        var estoques = estoque.map((result) => result)
        function results(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.createdAt)
                rows.push(values.quantidadeInserida)
                rows.push(values.valorDoProduto)
                rows.push(values.valorGasto)
                body.push(rows)
            }
            return body
        }
        function resultadoTotalRelatorio(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.mes)
                rows.push(values.quantidadeInserida)
                rows.push(values.valorTotalEstoque)
                rows.push(values.quantidadeArmazenada)
                body.push(rows)
            }
            return body
        }

        // init document
        let doc = new PDFDocument({ margin: 30, size: 'A4' });
        // save document
        const homedir = require('os').homedir();
        doc.pipe(fs.createWriteStream(homedir + "/Downloads/Relatorio.pdf"));

        const tableMaiorQuantidadeMensal = {
            title: "Relatorio Estoque",
            subtitle: "Maiores quantidades referente ao mês",
            headers: [{ label: "Data", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Do Produto", width: 130 },
            { label: "valor Gasto", width: 130 },
            ],
            rows: [
                ...results(diaDoMesOndeComprouMais[0])
            ],
        };
        const tableDiaDosMesesOndeComprouMais = {
            subtitle: "Maiores quantidades referente aos meses",
            headers: [{ label: "mês", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Do Produto", width: 130 },
            { label: "valor Gasto", width: 130 },
            ],
            rows: [
                ...results(diaDosMesesOndeComprouMais)
            ],
        };
        const tableAnosOndeComprouMais = {
            subtitle: "Maiores quantidades referente aos anos",
            headers: [{ label: "mês", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Do Produto", width: 130 },
            { label: "valor Gasto", width: 130 },
            ],
            rows: [
                ...results(anosOndeComprouMais)
            ],
        };

        const tableTotalMensal = {
            subtitle: "Quantidade total referente ao mês",
            headers: [{ label: "Data", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Total Estoque", width: 130 },
            { label: "Quantidade Armazenada", width: 130 },
            ],
            rows: [
                ...resultadoTotalRelatorio(somaTotalDoMes)
            ],
        };
        const tableTotaisMensais = {
            subtitle: "Quantidade total referente aos meses",
            headers: [{ label: "Data", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Total Estoque", width: 130 },
            { label: "Quantidade Armazenada", width: 130 },
            ],
            rows: [
                ...resultadoTotalRelatorio(somaTotalDosMeses)
            ],
        };
        const tableTotaisAnuais = {
            subtitle: "Quantidade total referente ao ano",
            headers: [{ label: "Data", width: 130, renderer: null },
            { label: "quantidade Inserida", width: 130 },
            { label: "valor Total Estoque", width: 130 },
            { label: "Quantidade Armazenada", width: 130 },
            ],
            rows: [
                ...resultadoTotalRelatorio(somaTotalDosAnos)
            ],
        };

        await doc.table(tableMaiorQuantidadeMensal, {
            width: 400,
        });
        await doc.table(tableTotalMensal, {
            width: 400,
        });
        await doc.table(tableDiaDosMesesOndeComprouMais, {
            width: 400,
        });
        await doc.table(tableTotaisMensais, {
            width: 400,
        });
        await doc.table(tableAnosOndeComprouMais, {
            width: 400,
        });
        await doc.table(tableTotaisAnuais, {
            width: 400,
        });

        // or columnsSize
        // await doc.table(table, {
        //     columnsSize: [500, 130, 130, 10],
        // });

        // done!
        doc.end();
        res.redirect("/dashboard/relatorios")
    }
}