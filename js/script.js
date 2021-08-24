function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);

    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";


            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};

//Final do CEP


//Variaveis com querySelector para as funções de responsividade
var inicio = document.querySelector('.c1')
var sobre = document.querySelector('.c2')
var quemSomos = document.querySelector('.c3')
var cardGas = document.querySelector('.cardGas')
var rodape = document.querySelector('#rodape')
var navbar = document.querySelector('.navbar')
var containerCentral = document.querySelector('.containerCentral')
var collapseLi = document.querySelectorAll('.teste')
//Final das variaveis

//Funções onde mostram o texto de cada parte ao clicar
function mostrarSobre() {
    sobre.style.display = "block";
    inicio.style.display = "none";
    quemSomos.style.display = "none";
}

function mostrarQuemSomos() {
    quemSomos.style.display = "block";
    sobre.style.display = "none";
    inicio.style.display = "none";
}

//Final da

//Funções que ajustam a tela usando a responsividade
if (window.matchMedia("(max-width: 575px)").matches) {
    function mostrarSobre() {
        sobre.style.display = "block";
        inicio.style.display = "none";
        quemSomos.style.display = "none";
        cardGas.style.display = "none";
        rodape.style.position = "absolute";
    }

    function mostrarQuemSomos() {
        quemSomos.style.display = "block";
        sobre.style.display = "none";
        inicio.style.display = "none";
        cardGas.style.display = "none";
        rodape.style.position = "absolute ";
    }
}
if (window.matchMedia("(max-width: 991px)").matches) {
    navbar.style.position = "absolute";
    navbar.style.width = "100%";
    navbar.style.top = "0";
    navbar.style.zIndex = "2";
    containerCentral.style.marginTop = "65px";
    collapseLi.forEach(function(x){
        x.setAttribute("data-toggle", "collapse");
        x.setAttribute("data-target", "#navbarSupportedContent");
    })
    
}
//final das funções