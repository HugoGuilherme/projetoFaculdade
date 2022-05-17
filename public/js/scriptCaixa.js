var table = document.getElementById("tableIdCaixa");
var rows = table.getElementsByTagName("tr");
for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function (row) {
        return function () {
            var id = row.getElementsByTagName("td")[0].innerHTML;
            var quantidadeDeGas = row.getElementsByTagName("td")[1].innerHTML;
            var formaDePagamento = row.getElementsByTagName("td")[2].innerHTML;
            var valorTotalCompra = row.getElementsByTagName("td")[3].innerHTML;
            var trocoTotalCompra = row.getElementsByTagName("td")[4].innerHTML;

            document.getElementById("quantidadeDeGas").value = quantidadeDeGas;
            document.getElementById("formaDePagamento").value = formaDePagamento;
            document.getElementById("valorTotalCompra").value = valorTotalCompra;
            document.getElementById("troco").value = trocoTotalCompra;

            document.getElementById("id").value = id;
            document.getElementById("idCancelamento").value = id;

        };
    };
    currentRow.onclick = createClickHandler(currentRow);
}
document.getElementById("valorTotal").value = document.getElementById("valorInserido").value - document.getElementById("valorRetirado").value;