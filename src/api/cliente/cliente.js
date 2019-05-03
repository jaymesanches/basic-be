const restful = require('node-restful')
const mongoose = restful.mongoose

const clienteSchema = new mongoose.Schema({ 
  codigo: { type: String, required: true }, 
  nome: { type: String, required: true }, 
  email: { type: String, required: false }, 
  instagram: { type: String, required: false }, 
  documento: { type: String, required: false }, 
  enderecos: [{
    cep: Number,
    logradouro: String,
    numero: String,
    complemento: String,
    cidade: String,
    estado: String,
    bairro: String,
    referencia: String,
    tipo: String
  }]
})
module.exports = restful.model('Cliente', clienteSchema)
