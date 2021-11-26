// Compiled using marko@4.13.4-1 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/projetofaculdade$1.0.0/public/view/funcionario.marko",
    components_helpers = require("marko/src/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    component_globals_tag = marko_loadTag(require("marko/src/components/taglib/component-globals-tag")),
    init_components_tag = marko_loadTag(require("marko/src/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!DOCTYPE html><html lang=\"pt-br\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Gás</title><link rel=\"stylesheet\" type=\"text/css\" href=\"estilo/style.css\"><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\"></head><body>");

  component_globals_tag({}, out);

  out.w("<section><nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\"><button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button><a class=\"navbar-brand ml-3 pr-2\" href=\"index.html\">GÁS LEGAL</a><button type=\"button\" class=\"login1 btn \" data-toggle=\"modal\" data-target=\"#exampleModal\"><img class=\"loginIcon\" src=\"imagens/abstract-user-flat-4.svg\"></button><div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\"><ul class=\"navbar-nav mr-auto\"><li class=\"nav-item \"><a class=\"nav-link collapseLi\" href=\"#\" onclick=\"mostrarInicio()\">Inicio</a></li><li class=\"nav-item\"><a class=\"nav-link collapseLi\" href=\"#\" onclick=\"mostrarSobre()\">Sobre</a></li><li class=\"nav-item\"><a class=\"nav-link collapseLi\" href=\"#\" onclick=\"mostrarQuemSomos()\">Quem somos</a></li></ul></div></nav><section><div class=\"modal fade\" id=\"exampleModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"exampleModalLabel\">Login</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><form><div class=\"form-group\"><label for=\"exampleInputEmail1\">Email:</label><input type=\"email\" class=\"form-control\" id=\"exampleInputEmail1\" aria-describedby=\"emailHelp\" placeholder=\"Enter email\"></div><div class=\"form-group\"><label for=\"exampleInputPassword1\">Senha</label><input type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" placeholder=\"Password\"></div><button type=\"submit\" class=\"btn btn-dark col-12\">Entrar</button></form></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-danger col-12\" data-toggle=\"modal\" data-target=\".bd-example-modal-lg\" data-dismiss=\" modal \">Cadastre-se</button></div></div></div></div></section><section><div class=\"modal fade bd-example-modal-lg\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myLargeModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"exampleModalLabel\">Cadastro</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><form class=\"form-row\" method=\"get\" action=\".\"><div class=\"form-row\"><div class=\"col-md-6 mb-3\"><label>Nome</label><input type=\"text\" class=\"form-control\" placeholder=\"nome\" required></div><div class=\"col-md-6 mb-3\"><label>Sobrenome</label><input type=\"text\" class=\"form-control\" placeholder=\"sobrenome\" required></div><div class=\"form-group col-md-6\"><label>Email</label><input type=\"email\" class=\"form-control\" placeholder=\"Email\" required></div><div class=\"form-group col-md-6\"><label>Senha</label><input type=\"password\" class=\"form-control\" placeholder=\"Senha\" required></div><div class=\"col-md-6 mb-3\"><label>CEP <input name=\"cep\" class=\"form-control\" type=\"text\" id=\"cep\" placeholder=\"CEP\" value=\"\" size=\"100%\" onblur=\"pesquisacep(this.value);\" required></label></div><div class=\"col-md-6 mb-3\"><label>NÚMERO <input type=\"text\" class=\"form-control\" placeholder=\"Numero\" size=\"100%\" name=\"numeroCasa\"></label></div><div class=\"col-md-6 mb-3\"><label>RUA <input name=\"rua\" class=\"form-control\" type=\"text\" size=\"100%\" id=\"rua\" disabled></label></div><div class=\"col-md-6 mb-3\"><label>BAIRRO <input name=\"bairro\" class=\"form-control\" type=\"text\" size=\"100%\" id=\"bairro\" disabled></label></div><div class=\"col-md-6 mb-3\"><label>CIDADE <input name=\"cidade\" class=\"form-control\" type=\"text\" size=\"100%\" id=\"cidade\" disabled></label></div><div class=\"col-md-6 mb-3\"><label>ESTADO <input name=\"uf\" class=\"form-control\" type=\"text\" id=\"uf\" size=\"100%\" disabled></label></div></div></form></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-dark col-12\">Enviar</button></div></div></div></div></section></section><section class=\"container containerCentral\"><div class=\"paginaCentral\"><div class=\"row\"><div class=\"col-sm-3 cardGas\"><img src=\"imagens/botijãoDeGas.png\"><h4 class=\"mt-4\">Gás de cozinha</h4><p class=\"mt-4\"> Compre o seu gás no valor de R$...</p><button class=\"btn btn-dark col-12 mt-3 mb-4\" data-toggle=\"modal\" data-target=\"#exampleModal\">COMPRAR</button></div><div class=\"col-sm-9 textoCorpo\"><div class=\"c1\"><h1 class=\"inicioh\">VENHA CONHECER O MELHOR GÁS DA REGIÃO</h1><p class=\"textCopor1\">O botijão de gás de 13 quilos, também conhecido como botijão de gás P13, é o gás de cozinha comum amplamente utilizado nos fogões residenciais em todo país. Seu principal uso está no preparo de alimentos e é altamente seguro, contendo dispositivo térmico de segurança chamado de plugue fusível. Dimensões: diâmetro 360 mm x altura 475mm</p></div><div class=\"c2\"><h1 class=\"inicioh\">SOBRE</h1><p>O botijão de gás de 13 quilos, também conhecido como botijão de gás P13, é o gás de cozinha comum amplamente utilizado nos fogões residenciais em todo país. Seu principal uso está no preparo de alimentos e é altamente seguro, contendo dispositivo térmico de segurança chamado de plugue fusível. Dimensões: diâmetro 360 mm x altura 475mm</p></div><div class=\"c3\"><h1 class=\"inicioh\">QUEM SOMOS</h1><p>O botijão de gás de 13 quilos, também conhecido como botijão de gás P13, é o gás de cozinha comum amplamente utilizado nos fogões residenciais em todo país. Seu principal uso está no preparo de alimentos e é altamente seguro, contendo dispositivo térmico de segurança chamado de plugue fusível. Dimensões: diâmetro 360 mm x altura 475mm</p></div></div></div></div></section><footer id=\"rodape\"><p>&copy; TADS - 2021</p></footer><script src=\"js/script.js\"></script><script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js \" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN \" crossorigin=\"anonymous \"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js \" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q \" crossorigin=\"anonymous \"></script><script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js \" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl \" crossorigin=\"anonymous \"></script>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "109");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/projetofaculdade$1.0.0/public/view/funcionario.marko",
    tags: [
      "marko/src/components/taglib/component-globals-tag",
      "marko/src/components/taglib/init-components-tag",
      "marko/src/taglibs/async/await-reorderer-tag"
    ]
  };
