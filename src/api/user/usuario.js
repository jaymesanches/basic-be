const restful = require('node-restful')
const mongoose = restful.mongoose
const usuarioSchema = new mongoose.Schema({ 
  nome: { type: String, required: true }, 
  email: { type: String, required: true }, 
  senha: { type: String, min: 6, max: 12, required: true } })
module.exports = restful.model('Usuario', usuarioSchema)
