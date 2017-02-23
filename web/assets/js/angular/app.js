var App = angular.module('sersApp', ['ngResource', 'autocomplete']);

App.controller('sersCtrl', function($scope, $resource){

  //RESOURCE DOS METODOS DEFAULT
  var ModeloRs = $resource('/modelors', null, {
    'update': { method:'PUT'},
    'get' : { method: 'GET', isArray:true}
  });

  //RESOURCE DO SERVICO DE BUSCA
  var ModeloRsSearch = $resource('/modelors/:pesquisa', {pesquisa:'@pesquisa'},{
    'get' : { method: 'GET', isArray:true }
  });

  //OBJETOS DE TELA
  $scope.listaRs = [];
  $scope.frasesChave = [];
  $scope.rs = {};
  $scope.pesquisa = '';
  $scope.mensagem = '';
  $scope.editar = false;


  //FUNCAO DE INICIO DA APLICACAO
  $scope.iniciar = function(){
    //BUSCA DESCRICOES DE MODELOS PARA O AUTOCOMPLETE
    ModeloRs.query(function(modeloRs){
      for(var i=0; i<modeloRs.length; i++){
        $scope.frasesChave.push(modeloRs[i].descricao);
      }
    });
  }
  //CHAMADA NO ON DOCUMENT READY
  $scope.iniciar();

  //FUNCAO DE PESQUISA
  $scope.pesquisar = function(){
    $scope.limpar();

    if($scope.pesquisa){
      var query = {pesquisa : $scope.pesquisa};

      ModeloRsSearch.get(query, function(modelosRs){
         for(var i=0; i<modelosRs.length; i++){
           $scope.listaRs.push(modelosRs[i]);
         }
        //TODO: TELA DE LOADING
      });
    }
  };

  //FUNCAO QUE INICIA TELA DE INSERCAO DE MODELO RS
  $scope.iniciarInsercao = function(){
    $scope.inserir = true;
    $scope.editar = true;
    $scope.rs = {};
    $scope.rs.tags = [];
  };

  //FUNCAO QUE INICIA TELA DE EDICAO DE MODELO RS
  $scope.iniciarEdicao = function(){
    $scope.editar = true;
  };

  //FUNCAO QUE DETALHA MODELO DE RS SELECIONADA NA TABELA
  $scope.detalhar = function(rs){
    $scope.rs = rs;
    $scope.editar = false;
  };

  //FUNCAO QUE ADICIONA TAGS A LISTA DE TAGS
  $scope.adicionarTag = function(){
    var tagAdicionar = $scope.rs.tag;

    if(tagAdicionar){
      //SE LISTA VAZIA ENTAO ADICIONA
      if($scope.rs.tags.length == 0){
        $scope.rs.tags.push(tagAdicionar);
        $scope.rs.tag = '';
      //SE LISTA NAO VAZIA ADICIONA CASO NAO EXISTA TAG
      }else{
        for(var i=0; i<$scope.rs.tags.length; i++){
          if($scope.rs.tags[i] !== tagAdicionar){
            $scope.rs.tags.push(tagAdicionar);
            $scope.rs.tag = '';
            break;
          }
        }
      }
    }
  };

  //REMOVE TAG DA LISTA DE TAGS
  $scope.removerTag = function(index){
    if($scope.editar){
      $scope.rs.tags.splice(index, 1);
    }
  }

  //SALVA INCLUSAO OU EDICAO DE MODELO RS
  $scope.salvar = function(){
    $scope.mensagem = '';

    var rs = $scope.rs;
    //CRIA OBJETO A SER SALVO
    var modeloRs = {
      numero: rs.numero,
      descricao: rs.descricao,
      grupo: rs.grupo,
      modelo: rs.modelo,
      detalhamento: rs.detalhamento,
      observacao: rs.observacao,
      tags: rs.tags
    };
    //SALVA SE NAO POSSUIR ID
    if(!rs._id){
      ModeloRs.save(modeloRs, function(data){
        if(data._id){
          $scope.rs = {};
          $scope.rs.tags = [];
          $scope.mensagem = 'Modelo de RS número '+ data.numero + ' criada com sucesso!'
        }
      });
      //ATUALIZA SE JA POSSUI ID
    }else{
      //ADICIONA ID AO OBJETO A SER ATUALIZACAO
      modeloRs._id = rs._id;
      ModeloRs.update(modeloRs, function(data){
        if(data._id){
          $scope.mensagem = 'Modelo de RS número '+ data.numero + ' atualizada com sucesso!'
        }
      });
    }
  };

//ModeloRs.remove({_id: convidado._id});

  //VOLTA PARA A TELA/ ANTERIOR
  $scope.voltar = function(){
    $scope.rs = {};
    $scope.editar = false;
    $scope.mensagem = '';
  };

  //LIMPA FORMULARIO OU VOLTA PARA TELA INICAL
  $scope.limpar = function(){
    $scope.mensagem = '';
    $scope.listaRs = [];
    $scope.rs = {};
    $scope.editar = false;
    $scope.inserir = false;
  };

});

App.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

App.directive('autoComplete', function($timeout) {
      return function(scope, iElement, iAttrs) {
              $(iElement).autocomplete({
                  source: scope[iAttrs.uiItems],
                  select: function() {
                      $timeout(function() {
                        iElement.trigger('input');
                      }, 0);
                  }
              });
      };
  });
