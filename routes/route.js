const express = require('express');
const bodyParser  = require('body-parser');
const connection = require('../config/database.js');
const ModeloRs = require('../models/ModeloRs');
const Tag = require('../models/Tag');
const search = require('../search/search');

module.exports = function(app){

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// configure router
const router = express.Router();
app.use('/', router);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

//ROUTES
router.route('/modelors/')
//POST TO INSERT
.post(function(req, res){
        console.log(req.body.detalhamento);
        console.log(req.body.observacao);
        var modeloRs = new ModeloRs({
          numero: req.body.numero,
          descricao: req.body.descricao,
          grupo: req.body.grupo,
          modelo: req.body.modelo,
          detalhamento: req.body.detalhamento,
          observacao: req.body.observacao,
          tags: req.body.tags
        });
        modeloRs.save(function(err){
          if (err)
            res.send(err);
          res.json({_id: modeloRs._id, numero: req.body.numero});
        });
      })

//PUT TO UPDATE
.put(function(req, res){
      var update ={
        numero: req.body.numero,
        descricao: req.body.descricao,
        grupo: req.body.grupo,
        modelo: req.body.modelo,
        detalhamento: req.body.detalhamento,
        observacao: req.body.observacao,
        tags: req.body.tags
      };
      ModeloRs.update({_id:req.body._id}, update, function(err){
        if(err)
          res.send(err);
        res.json({_id: req.body._id, numero: req.body.numero});
      });
})

//GET TO LIST descricao
.get(function(req, res){
      ModeloRs.find({}).sort([['descricao', 'ascending']])
        .exec(function (err, descricao) {
          if (err)
            console.log(err);
          else{
            res.send(JSON.stringify(descricao));
          }
      });
    });

router.route('/modelors/:pesquisa')
//ENGINE DE BUSCA
.get(function(req, res){
      if(req.params.pesquisa){
        let pesquisa = req.params.pesquisa;
        search(pesquisa, res);
      }
  });

router.route('/modelors/:numero')
//DELETE
.delete(function(req, res){
  ModeloRs.remove({
        numero: req.params.numero
    }, function(err, conv) {
        if (err)
            res.send(err);
        res.json({deletado: true, message: 'Successfully deleted' });
    });
});

};
