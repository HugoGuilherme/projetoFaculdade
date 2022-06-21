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
const path = require('path');

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

        // Querys do ESTOQUE
        const diaDoMesOndeComprouMais = await sequelize.query("SELECT MONTH(createdAt), MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM  Estoques where Month(createdAt) = " + fromMonth + " GROUP BY MONTH(createdAt)")

        var diaDosMesesOndeComprouMais = await sequelize.query("SELECT MONTH(createdAt) as MONTH, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM Estoques GROUP BY MONTH(createdAt)")
        diaDosMesesOndeComprouMais = diaDosMesesOndeComprouMais[0]

        var anosOndeComprouMais = await sequelize.query("SELECT YEAR(createdAt) as YEAR, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM Estoques GROUP BY YEAR(createdAt)")
        anosOndeComprouMais = anosOndeComprouMais[0]

        var somaTotalDoMes = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTH(e.createdAt) as mes from Estoques e where month(e.createdAt) = " + fromMonth + "  group by month(e.createdAt)")
        somaTotalDoMes = (somaTotalDoMes[0]);

        var somaTotalDosMeses = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTH(e.createdAt) as mes from Estoques e group by month(e.createdAt)")
        somaTotalDosMeses = (somaTotalDosMeses[0]);

        var somaTotalDosAnos = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, YEAR(e.createdAt) as mes from Estoques e group by YEAR(e.createdAt)")
        somaTotalDosAnos = (somaTotalDosAnos[0]);

        // FIM QUERYS ESTOQUE

        // QUERYS PEDIDOS
        var valorTotalDaSomaDosPedidosFinalizadosDoMes = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos p where statusPedidos = 'finalizado' and MONTH(p.createdAt) = " + fromMonth + ";")
        valorTotalDaSomaDosPedidosFinalizadosDoMes = valorTotalDaSomaDosPedidosFinalizadosDoMes[0]

        var maiorPedidoRealizadoNoMes = await sequelize.query("select quantidadePedido, valorTotal , tipoDePagamentoNaEntrega , MONTH(createdAt) as mes from Pedidos where quantidadePedido = (select max(quantidadePedido) from Pedidos where MONTH(createdAt) = " + fromMonth + ");")
        maiorPedidoRealizadoNoMes = maiorPedidoRealizadoNoMes[0]

        var valorTotalDaSomaDosPedidosFinalizadosDosMeses = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos p where statusPedidos = 'finalizado' GROUP BY MONTH(p.createdAt);")
        valorTotalDaSomaDosPedidosFinalizadosDosMeses = valorTotalDaSomaDosPedidosFinalizadosDosMeses[0]

        var maiorPedidoRealizadoDosMeses = await sequelize.query("select max(quantidadePedido) as quantidadePedido, max(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos group by month(createdAt);")
        maiorPedidoRealizadoDosMeses = maiorPedidoRealizadoDosMeses[0]

        var valorTotalDaSomaDosPedidosFinalizadosDosAnos = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, YEAR(createdAt) as ano from Pedidos p where statusPedidos = 'finalizado' GROUP BY YEAR(p.createdAt);")
        valorTotalDaSomaDosPedidosFinalizadosDosAnos = valorTotalDaSomaDosPedidosFinalizadosDosAnos[0]

        var maiorPedidoRealizadoDosAnos = await sequelize.query("select max(quantidadePedido) as quantidadePedido, max(valorTotal) as valorTotal, YEAR(createdAt) as ano from Pedidos group by YEAR(createdAt);")
        maiorPedidoRealizadoDosAnos = maiorPedidoRealizadoDosAnos[0]

        // FIM QUERYS PEDIDOS

        //query clientes
        var SomarPedidoDoClienteRealizadoDomes = await sequelize.query("SELECT c.id as id, c.nome as nome, max(p.quantidadePedido) as quantidadePedido, max(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where  p.statusPedidos = 'finalizado' and month(p.createdAt) = " + fromMonth + " group by c.id;")
        SomarPedidoDoClienteRealizadoDomes = SomarPedidoDoClienteRealizadoDomes[0]
        var maiorPedidoDoClienteRealizadoDomes = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' and MONTH(p.createdAt) =  " + fromMonth + " group by nome;")
        maiorPedidoDoClienteRealizadoDomes = maiorPedidoDoClienteRealizadoDomes[0]

        var SomarPedidoDoClienteRealizadoDosmeses = await sequelize.query("select p.ClienteId  as id, c.nome as nome, (quantidadePedido), (p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Pedidos p inner join Clientes c ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' and quantidadePedido in (select max(quantidadePedido) from Pedidos  group by month(createdAt));")
        SomarPedidoDoClienteRealizadoDosmeses = SomarPedidoDoClienteRealizadoDosmeses[0]
        var maiorPedidoDoClienteRealizadoDosmeses = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        maiorPedidoDoClienteRealizadoDosmeses = maiorPedidoDoClienteRealizadoDosmeses[0]

        var SomarPedidoDoClienteRealizadoDosAnos = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, year(p.createdAt) as ano FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        SomarPedidoDoClienteRealizadoDosAnos = SomarPedidoDoClienteRealizadoDosAnos[0]
        var maiorPedidoDoClienteRealizadoDosAnos = await sequelize.query("SELECT c.id as id, c.nome as nome, max(p.quantidadePedido) as quantidadePedido, max(p.valorTotal) as valorTotal, year(p.createdAt) as ano FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        maiorPedidoDoClienteRealizadoDosAnos = maiorPedidoDoClienteRealizadoDosAnos[0]
        //final da query

        res.render('areaFuncionario/funcionarioRelatorios', { diaDoMesOndeComprouMais, diaDosMesesOndeComprouMais, anosOndeComprouMais, somaTotalDoMes, somaTotalDosMeses, somaTotalDosAnos, valorTotalDaSomaDosPedidosFinalizadosDoMes, maiorPedidoRealizadoNoMes, valorTotalDaSomaDosPedidosFinalizadosDosMeses, maiorPedidoRealizadoDosMeses, valorTotalDaSomaDosPedidosFinalizadosDosAnos, maiorPedidoRealizadoDosAnos, maiorPedidoDoClienteRealizadoDomes, SomarPedidoDoClienteRealizadoDomes, SomarPedidoDoClienteRealizadoDosmeses, maiorPedidoDoClienteRealizadoDosmeses, SomarPedidoDoClienteRealizadoDosAnos, maiorPedidoDoClienteRealizadoDosAnos })
    }

    static async EnviarRelatorio(req, res) {
        var fromDate = Date.now()
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        const diaDoMesOndeComprouMais = await sequelize.query("SELECT date_format(createdAt, '%d/%m/%Y') as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM Estoques where Month(createdAt) = " + fromMonth + " GROUP BY MONTH(createdAt)")

        var diaDosMesesOndeComprouMais = await sequelize.query("SELECT MONTH(createdAt) as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM Estoques GROUP BY MONTH(createdAt)")
        diaDosMesesOndeComprouMais = diaDosMesesOndeComprouMais[0]

        var anosOndeComprouMais = await sequelize.query("SELECT YEAR(createdAt) as createdAt, MAX(quantidadeInserida) as quantidadeInserida, valorDoProduto, (quantidadeInserida * valorDoProduto) as valorGasto FROM Estoques GROUP BY YEAR(createdAt)")
        anosOndeComprouMais = anosOndeComprouMais[0]

        var somaTotalDoMes = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTH(e.createdAt) as mes from Estoques e where month(e.createdAt) = " + fromMonth + "  group by month(e.createdAt)")
        somaTotalDoMes = (somaTotalDoMes[0]);

        var somaTotalDosMeses = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, MONTH(e.createdAt) as mes from Estoques e group by month(e.createdAt)")
        somaTotalDosMeses = (somaTotalDosMeses[0]);

        var somaTotalDosAnos = await sequelize.query("select SUM(e.quantidadeInserida) as quantidadeInserida, SUM(e.valorTotal) as valorTotalEstoque, SUM(e.valorDoProduto) as valorDoProduto, SUM(e.quantidadeArmazenada) as quantidadeArmazenada, YEAR(e.createdAt) as mes from Estoques e group by YEAR(e.createdAt)")
        somaTotalDosAnos = (somaTotalDosAnos[0]);

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

        let i;
        let end;
        // init document
        let doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
        // save document
        const homedir = require('os').homedir();
     
        const tableMaiorQuantidadeMensal = {
            title: "Relatorio Estoque - " + today,
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
            subtitle: "Quantidade total referente aos anos",
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
        const range = doc.bufferedPageRange();
        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            doc.switchToPage(i);
            doc.text(`Page ${i + 1} of ${range.count}`, { align: 'right' });
        }
        // manually flush pages that have been buffered
        doc.flushPages();
        doc.pipe(fs.createWriteStream("./pdf/RelatorioDoEstoque.pdf"));
        doc.end();        
        
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          } 
          
          run();
          
          async function run() {
            await delay(1000);
            res.download("./pdf/RelatorioDoEstoque.pdf");
          }
    }

    static async relatorioPedidosPDF(req, res) {
        var fromDate = Date.now()
        var fromDateYear = new Date(fromDate).getFullYear();
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        var resultadoGeralTotal = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, count(quantidadePedido) as pedidosFeitosPeloCliente  from Pedidos p where statusPedidos = 'finalizado';")
        var resultadoGeralTotal = resultadoGeralTotal[0]

        var valorTotalDaSomaDosPedidosFinalizadosDoMes = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos p where statusPedidos = 'finalizado' and MONTH(p.createdAt) = " + fromMonth + ";")
        valorTotalDaSomaDosPedidosFinalizadosDoMes = valorTotalDaSomaDosPedidosFinalizadosDoMes[0]

        var maiorPedidoRealizadoNoMes = await sequelize.query("select quantidadePedido, valorTotal , tipoDePagamentoNaEntrega , MONTH(createdAt) as mes from Pedidos where quantidadePedido = (select max(quantidadePedido) from Pedidos where MONTH(createdAt) = " + fromMonth + ");")
        maiorPedidoRealizadoNoMes = maiorPedidoRealizadoNoMes[0]

        var valorTotalDaSomaDosPedidosFinalizadosDosMeses = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos p where statusPedidos = 'finalizado' GROUP BY MONTH(p.createdAt);")
        valorTotalDaSomaDosPedidosFinalizadosDosMeses = valorTotalDaSomaDosPedidosFinalizadosDosMeses[0]

        var maiorPedidoRealizadoDosMeses = await sequelize.query("select max(quantidadePedido) as quantidadePedido, max(valorTotal) as valorTotal, MONTH(createdAt) as mes from Pedidos group by month(createdAt);")
        maiorPedidoRealizadoDosMeses = maiorPedidoRealizadoDosMeses[0]

        var valorTotalDaSomaDosPedidosFinalizadosDosAnos = await sequelize.query("select sum(quantidadePedido) as quantidadePedido, sum(valorTotal) as valorTotal, YEAR(createdAt) as ano from Pedidos p where statusPedidos = 'finalizado' GROUP BY YEAR(p.createdAt);")
        valorTotalDaSomaDosPedidosFinalizadosDosAnos = valorTotalDaSomaDosPedidosFinalizadosDosAnos[0]

        var maiorPedidoRealizadoDosAnos = await sequelize.query("select max(quantidadePedido) as quantidadePedido, max(valorTotal) as valorTotal, YEAR(createdAt) as ano from Pedidos group by YEAR(createdAt);")
        maiorPedidoRealizadoDosAnos = maiorPedidoRealizadoDosAnos[0]

        console.log(fromMonth)
        console.log(maiorPedidoRealizadoNoMes)

        function results(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.mes)
                rows.push(values.quantidadePedido)
                rows.push(values.valorTotal)
                body.push(rows)
            }
            return body
        }

        function resultsGeral(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.pedidosFeitosPeloCliente)
                rows.push(values.quantidadePedido)
                rows.push(values.valorTotal)
                body.push(rows)
            }
            return body
        }

        function resultsAno(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.ano)
                rows.push(values.quantidadePedido)
                rows.push(values.valorTotal)
                body.push(rows)
            }
            return body
        }

        function resultadoTotalRelatorio(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.mes)
                rows.push(values.quantidadePedido)
                rows.push(values.valorTotal)
                rows.push(values.tipoDePagamentoNaEntrega)
                body.push(rows)
            }
            return body
        }
        let i;
        let end;
        // init document
        let doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
        // save document
        const homedir = require('os').homedir();

        console.log(resultadoGeralTotal)

        const tableResultadoGeralTotal = {
            title: "Relatorio Pedido - " + today,
            subtitle: "Resultado total do mês",
            headers: [{ label: "Quantidade de Pedidos Feito Pelo Cliente", width: 170 },
            { label: "Quantidade de Botijões Vendidos", width: 170 },
            { label: "Valor Total", width: 170 }
            ],
            rows: [
                ...resultsGeral(resultadoGeralTotal)
            ],
        };
        await doc.table(tableResultadoGeralTotal, {
            width: 400,
        });

        console.log(valorTotalDaSomaDosPedidosFinalizadosDoMes)
        const tableFinalizadosDoMes = {
            subtitle: "Soma Total do Mês",
            headers: [{ label: "Mês", width: 170, renderer: null },
            { label: "Quantidade de Pedidos de Botijões", width: 170 },
            { label: "Valor Total", width: 170 }
            ],
            rows: [
                ...results(valorTotalDaSomaDosPedidosFinalizadosDoMes)
            ],
        };
        await doc.table(tableFinalizadosDoMes, {
            width: 400,
        });
        
        // const tableMaiorPedidoRealizadoNoMes = {
        //     subtitle: "Maior Pedido Realizado no Mês",
        //     headers: [{ label: "Mês", width: 128, renderer: null },
        //     { label: "Quantidade de Pedidos de Botijões", width: 128 },
        //     { label: "Valor Total", width: 127 }
        //     ],
        //     rows: [
        //         ...resultadoTotalRelatorio(maiorPedidoRealizadoNoMes)
        //     ],
        // };
        // await doc.table(tableMaiorPedidoRealizadoNoMes, {
        //     width: 400,
        // });

        const tableValorTotalDaSomaDosPedidosFinalizadosDosMeses = {
            subtitle: "Soma Total dos Meses",
            headers: [{ label: "Mês", width: 170, renderer: null },
            { label: "Quantidade de Pedidos de Botijões", width: 170 },
            { label: "Valor Total", width: 170 }
            ],
            rows: [
                ...results(valorTotalDaSomaDosPedidosFinalizadosDosMeses)
            ],
        };
        await doc.table(tableValorTotalDaSomaDosPedidosFinalizadosDosMeses, {
            width: 400,
        });

        const tableMaiorPedidoRealizadoDosMeses = {
            subtitle: "Maior Pedido Realizado dos Meses",
            headers: [{ label: "Mês", width: 170, renderer: null },
            { label: "Quantidade de Pedidos de Botijões", width: 170 },
            { label: "Valor Total", width: 170 }
            ],
            rows: [
                ...results(maiorPedidoRealizadoDosMeses)
            ],
        };
        await doc.table(tableMaiorPedidoRealizadoDosMeses, {
            width: 400,
        });

        const tableValorTotalDaSomaDosPedidosFinalizadosDosAnos = {
            subtitle: "Soma Total dos Anos",
            headers: [{ label: "Ano", width: 170, renderer: null },
            { label: "Quantidade de Pedidos de Botijões", width: 170 },
            { label: "Valor Total", width: 170 }
            ],
            rows: [
                ...resultsAno(valorTotalDaSomaDosPedidosFinalizadosDosAnos)
            ],
        };
        await doc.table(tableValorTotalDaSomaDosPedidosFinalizadosDosAnos, {
            width: 400,
        });

        const tableMaiorPedidoRealizadoDosAnos = {
            subtitle: "Maior Pedido Realizado dos Anos",
            headers: [{ label: "Ano", width: 170, renderer: null, },
            { label: "Quantidade de Pedidos de Botijões", width: 170, },
            { label: "Valor Total", width: 170, }
            ],
            rows: [
                ...resultsAno(maiorPedidoRealizadoDosAnos)
            ],
        };
        await doc.table(tableMaiorPedidoRealizadoDosAnos, {

            width: 400,
        });
        const range = doc.bufferedPageRange();
        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            doc.switchToPage(i);
            doc.text(`Page ${i + 1} of ${range.count}`, { align: 'right' });
        }
        // manually flush pages that have been buffered
        doc.flushPages();
        doc.pipe(fs.createWriteStream("./pdf/RelatorioPedido.pdf"));
        doc.end();
                
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          } 
          
          run();
          
          async function run() {
            await delay(1000);
            res.download("./pdf/RelatorioPedido.pdf");
          }
    }

    static async EnviarRelatorioClientes(req, res) {
        var fromDate = Date.now()
        var fromDateYear = new Date(fromDate).getFullYear();
        var fromDateMonth = new Date(fromDate);
        var fromMonth = (fromDateMonth.getMonth() + 1);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        var SomarPedidoDoClienteRealizadoDomes = await sequelize.query("SELECT c.id as id, c.nome as nome, max(p.quantidadePedido) as quantidadePedido, max(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where  p.statusPedidos = 'finalizado' and month(p.createdAt) = " + fromMonth + " group by c.id;")
        SomarPedidoDoClienteRealizadoDomes = SomarPedidoDoClienteRealizadoDomes[0]
        var maiorPedidoDoClienteRealizadoDomes = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' and MONTH(p.createdAt) =  " + fromMonth + " group by nome;")
        maiorPedidoDoClienteRealizadoDomes = maiorPedidoDoClienteRealizadoDomes[0]

        var SomarPedidoDoClienteRealizadoDosmeses = await sequelize.query("select p.ClienteId  as id, c.nome as nome, (quantidadePedido), (p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Pedidos p inner join Clientes c ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' and quantidadePedido in (select max(quantidadePedido) from Pedidos  group by month(createdAt));")
        SomarPedidoDoClienteRealizadoDosmeses = SomarPedidoDoClienteRealizadoDosmeses[0]
        var maiorPedidoDoClienteRealizadoDosmeses = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, month(p.createdAt) as mes FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        maiorPedidoDoClienteRealizadoDosmeses = maiorPedidoDoClienteRealizadoDosmeses[0]

        var SomarPedidoDoClienteRealizadoDosAnos = await sequelize.query("SELECT c.id as id, c.nome as nome, sum(p.quantidadePedido) as quantidadePedido, sum(p.valorTotal) as valorTotal, year(p.createdAt) as ano FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        SomarPedidoDoClienteRealizadoDosAnos = SomarPedidoDoClienteRealizadoDosAnos[0]
        var maiorPedidoDoClienteRealizadoDosAnos = await sequelize.query("SELECT c.id as id, c.nome as nome, max(p.quantidadePedido) as quantidadePedido, max(p.valorTotal) as valorTotal, year(p.createdAt) as ano FROM Clientes c INNER JOIN Pedidos p ON p.ClienteId = c.id where p.statusPedidos = 'finalizado' group by c.id;")
        maiorPedidoDoClienteRealizadoDosAnos = maiorPedidoDoClienteRealizadoDosAnos[0]

        function results(value) {
            const body = []
            for (let values of value) {
                const rows = new Array()
                rows.push(values.id)
                rows.push(values.nome)
                rows.push(values.quantidadePedido)
                rows.push(values.valorTotal)
                rows.push(values.mes)
                body.push(rows)
            }
            return body
        }
        // init document
        let i;
        let end;
        let doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
        // save document
        const homedir = require('os').homedir();

        const tableSomarPedidoDoClienteRealizadoDomes = {
            title: "RELATORIO CLIENTES - " + today,
            subtitle: "Soma Total do Mês",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(SomarPedidoDoClienteRealizadoDomes)
            ],
        };
        await doc.table(tableSomarPedidoDoClienteRealizadoDomes, {
            width: 400,
        });

        const tablemaiorPedidoDoClienteRealizadoDomes = {
            subtitle: "Valor maximo do mês",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(maiorPedidoDoClienteRealizadoDomes)
            ],
        };
        await doc.table(tablemaiorPedidoDoClienteRealizadoDomes, {
            width: 400,
        });
        const tableSomarPedidoDoClienteRealizadoDosmeses = {
            subtitle: "Soma Total dos Meses",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(SomarPedidoDoClienteRealizadoDosmeses)
            ],
        };
        await doc.table(tableSomarPedidoDoClienteRealizadoDosmeses, {
            width: 400,
        });
        const tablemaiorPedidoDoClienteRealizadoDosmeses = {
            subtitle: "Valor maximo dos meses",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(maiorPedidoDoClienteRealizadoDosmeses)
            ],
        };
        await doc.table(tablemaiorPedidoDoClienteRealizadoDosmeses, {
            width: 400,
        });
        const tableSomarPedidoDoClienteRealizadoDosAnos = {
            subtitle: "Soma Total dos anos",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(SomarPedidoDoClienteRealizadoDosAnos)
            ],
        };
        await doc.table(tableSomarPedidoDoClienteRealizadoDosAnos, {
            width: 400,
        });
        const tablemaiorPedidoDoClienteRealizadoDosAnos = {
            subtitle: "Valor maximo dos anos",
            headers: [{ label: "id", width: 105, renderer: null },
            { label: "nome", width: 105 },
            { label: "quantidadePedido", width: 105 },
            { label: "Valor Total", width: 105 },
            { label: "mês", width: 105 },
            ],
            rows: [
                ...results(maiorPedidoDoClienteRealizadoDosAnos)
            ],
        };
        await doc.table(tablemaiorPedidoDoClienteRealizadoDosAnos, {
            width: 400,
        });
        // see the range of buffered pages
        const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }
        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            doc.switchToPage(i);
            doc.text(`Page ${i + 1} of ${range.count}`, {
                align: 'right'
            });
        }
        // manually flush pages that have been buffered
        doc.flushPages();

        doc.pipe(fs.createWriteStream("./pdf/RelatorioClientes.pdf"));

        doc.end();

        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          } 
          
          run();
          
          async function run() {
            await delay(1000);
            res.download("./pdf/RelatorioClientes.pdf");
          }       
    }
}