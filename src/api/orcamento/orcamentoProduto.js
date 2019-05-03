const restful = require('node-restful')
const mongoose = restful.mongoose

const orcamentoProdutoSchema = new mongoose.Schema({ 
  quantidade: { type: Number, required: false }, 
  vlrUnitario: { type: Number, required: false }, 
  produto: {type: mongoose.Schema.Types.ObjectId, ref: 'Produto'}
})
module.exports = restful.model('OrcamentoProduto', orcamentoProdutoSchema)
