const connection = require('../config/database.js');
const ModeloRs = require('../models/ModeloRs');
//const Tag = require('../models/Tag');

module.exports = function(pesquisa, res){

  //BUSCA TODOS PARA VERIFICAR QUAIS POSSUEM PALAVRA CHAVE
  ModeloRs.find({}).sort([['descricao', 'ascending']])
    .exec(function (err, modelosRs) {
      if (err)
        console.log(err);
      else{
        let resultadoPesquisa = [];
        //QUEBRA PESQUISA EM ARRAY COM PALAVRAS CHAVE PARA PESQUISA
        let palavrasChave = pesquisa.split(' ');

        for(var i = 0; i < modelosRs.length; i++){
          for(var k = 0; k < palavrasChave.length; k++){
            if(!isPalavrasIgnoradas(palavrasChave[k])){
              //VERIFICA SE ALGUMAS DAS TAGS POSSUEM AS PALAVRAS CHAVES DA PESQUISA
              var tags = modelosRs[i].tags;
              for(var j = 0; j < tags.length; j++){
                if(tags[j].toUpperCase() === palavrasChave[k].toUpperCase()){
                adicionaNaoRepedido(resultadoPesquisa, modelosRs[i]);
                break;
                }
              }
              //VERIFICA TODAS AS PALAVRAS DA DESCRICAO E COMPARA COM TODAS
              //AS PALAVRAS ENVIADAS NA PESQUISA
              let descricaoChave = modelosRs[i].descricao.split(' ');
              for(var l = 0; l < descricaoChave.length; l++){
                if(palavrasChave[k].toUpperCase() === descricaoChave[l].toUpperCase()){
                  adicionaNaoRepedido(resultadoPesquisa, modelosRs[i]);
                  break;
                }
              }
            }
          }
        }
        res.send(JSON.stringify(resultadoPesquisa));
      }
  });

};

const adicionaNaoRepedido = function(lista, objeto){
  if(objeto){
    let repetido = false;
    for(var i = 0; i < lista.length; i++){
      if(lista[i]._id == objeto._id){
        repetido = true;
        break;
      }
    }
    if(!repetido){
      lista.push(objeto);
    }
  }
}

const palavrasIgnoradas = ['de', 'para', 'pra', 'em', 'na'];
const isPalavrasIgnoradas = function(palavra){
  let isPalavraIgnorada = false;
  for(var i = 0; i < palavrasIgnoradas.length; i++){
    if(palavrasIgnoradas[i].toUpperCase() === palavra.toUpperCase()){
      isPalavraIgnorada = true;
      break;
    }
  }
  return isPalavraIgnorada;
}
