const restful = require('node-restful')
const mongoose = restful.mongoose

const orcamentoProdutoSchema = new mongoose.Schema({ 
  quantidade: { type: Number, required: true }, 
  vlrUnitario: { type: Number, required: true }, 
  tamanho: { type: String, required: true, uppercase: true, trim: true },
  produto: {type: mongoose.Schema.Types.ObjectId, ref: 'Produto'}
});

module.exports = restful.model('OrcamentoProduto', orcamentoProdutoSchema)
