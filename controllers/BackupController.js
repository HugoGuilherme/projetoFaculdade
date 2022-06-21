const Cliente = require('../models/Cliente')
const Funcionario = require('../models/Funcionario')
const Estoque = require('../models/Estoque')
const Pedido = require("../models/Pedido")
const Caixa = require('../models/Caixa')
var XLSX = require("xlsx");
function pegarData() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today
}

module.exports = class BackupController {

    static async paginaBackup(req, res) {
        res.render('areaFuncionario/funcionarioBackup')
    }

    static async criarBackup(req, res) {
        const homedir = require('os').homedir();
        const workbook = XLSX.utils.book_new();

        //Função para pegar o nome das colunas
        function columnsNames(name) {
            const nameColumnsKeys = [];
            for (let key in name.rawAttributes) {
                nameColumnsKeys.push(key)
            }
            return nameColumnsKeys
        }

        //Pegando os valores referente as tabelas
        const allValues = await Cliente.findAll({ raw: true })
        const dataClientes = [];
        for (let values of allValues) {
            var dataCriada = values.createdAt.toString();
            var dataAtualizada = values.updatedAt.toString();
            const rows = new Array()
            rows.push(values.id)
            rows.push(values.nome)
            rows.push(values.cpf)
            rows.push(values.endereco)
            rows.push(values.dataDeNascimento)
            rows.push(values.status)
            rows.push(values.email)
            rows.push(values.senha)
            rows.push(dataCriada)
            rows.push(dataAtualizada)
            dataClientes.push(rows)
        }

        const allValuesFuncionarios = await Funcionario.findAll({ raw: true })
        const dataFuncionarios = [];
        for (let values of allValuesFuncionarios) {
            var dataCriada = values.createdAt.toString();
            var dataAtualizada = values.updatedAt.toString();
            const rows = new Array()
            rows.push(values.id)
            rows.push(values.nome)
            rows.push(values.cpf)
            rows.push(values.endereco)
            rows.push(values.dataDeNascimento)
            rows.push(values.status)
            rows.push(values.email)
            rows.push(values.senha)
            rows.push(dataCriada)
            rows.push(dataAtualizada)
            dataFuncionarios.push(rows)
        }

        const allValuesEstoques = await Estoque.findAll({ raw: true })
        const dataEstoque = [];
        for (let values of allValuesEstoques) {
            var dataCriada = values.createdAt.toString();
            var dataAtualizada = values.updatedAt.toString();
            const rows = new Array()
            rows.push(values.id)
            rows.push(values.nomeDoProduto)
            rows.push(values.valorDoProduto)
            rows.push(values.quantidadeInserida)
            rows.push(values.quantidadeVendida)
            rows.push(values.quantidadeArmazenada)
            rows.push(values.valorTotal)
            rows.push(values.data)
            rows.push(dataCriada)
            rows.push(dataAtualizada)
            dataEstoque.push(rows)
        }

        const allValuesPedido = await Pedido.findAll({ raw: true })
        const dataPedido = [];
        for (let values of allValuesPedido) {
            var dataCriada = values.createdAt.toString();
            var dataAtualizada = values.updatedAt.toString();
            const rows = new Array()
            rows.push(values.id)
            rows.push(values.statusPedidos)
            rows.push(values.quantidadePedido)
            rows.push(values.valorTotal)
            rows.push(values.tipoDePagamentoNaEntrega)
            rows.push(values.troco)
            rows.push(dataCriada)
            rows.push(dataAtualizada)
            rows.push(values.ClienteId)
            rows.push(values.FuncionarioId)
            dataPedido.push(rows)
        }

        const allValuesCaixa = await Caixa.findAll({ raw: true })
        const dataCaixa = [];
        for (let values of allValuesCaixa) {
            var dataCriada = values.createdAt.toString();
            var dataAtualizada = values.updatedAt.toString();
            const rows = new Array()
            rows.push(values.id)
            rows.push(values.valorAdicionado)
            rows.push(values.valorRetirado)
            rows.push(values.valorTotal)
            rows.push(dataCriada)
            rows.push(dataAtualizada)
            rows.push(values.PedidoId)
            rows.push(values.FuncionarioId)
            dataCaixa.push(rows)
        }

        //setando os valores para criar cada tabela do excel
        const workSheetDataClientes = [columnsNames(Cliente), ...dataClientes]
        const workSheetClientes = XLSX.utils.aoa_to_sheet(workSheetDataClientes)
        XLSX.utils.book_append_sheet(workbook, workSheetClientes, "Clientes")

        const workSheetDataFuncionarios = [columnsNames(Funcionario), ...dataFuncionarios]
        const workSheetFuncionarios = XLSX.utils.aoa_to_sheet(workSheetDataFuncionarios)
        XLSX.utils.book_append_sheet(workbook, workSheetFuncionarios, "Funcionarios")

        const workSheetDataEstoque = [columnsNames(Estoque), ...dataEstoque]
        const workSheetEstoque = XLSX.utils.aoa_to_sheet(workSheetDataEstoque)
        XLSX.utils.book_append_sheet(workbook, workSheetEstoque, "Estoque")
        XLSX.writeFile(workbook, homedir + "/Downloads/Backup - " + pegarData() + ".xlsx")

        const workSheetDataPedido = [columnsNames(Pedido), ...dataPedido]
        const workSheetPedido = XLSX.utils.aoa_to_sheet(workSheetDataPedido)
        XLSX.utils.book_append_sheet(workbook, workSheetPedido, "Pedido")
        XLSX.writeFile(workbook, homedir + "/Downloads/Backup - " + pegarData() + ".xlsx")

        const workSheetDataCaixa = [columnsNames(Caixa), ...dataCaixa]
        const workSheetCaixa = XLSX.utils.aoa_to_sheet(workSheetDataCaixa)
        XLSX.utils.book_append_sheet(workbook, workSheetCaixa, "Caixa")

        //função que cria o arquivo xlsx
        XLSX.writeFile(workbook, "./Backup - " + pegarData() + ".xlsx")
        res.redirect('/dashboard/backup')
    }
}