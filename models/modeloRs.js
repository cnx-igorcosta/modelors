const mongoose = require('mongoose');
//const Tag = require('tag');
const Schema = mongoose.Schema;

const modeloRsSchema = new Schema({
  numero : {type : Number, index: {unique: true}},
  descricao: {type : String},
  grupo: {type : String},
  modelo: {type : String},
  detalhamento: {type : String},
  observacao: {type :String},
  //tags: [ {type : mongoose.Schema.ObjectId, ref : 'Tag'} ]
  tags: [String]
});

const ModeloRs = mongoose.model('Convidado', modeloRsSchema);

module.exports = ModeloRs;
