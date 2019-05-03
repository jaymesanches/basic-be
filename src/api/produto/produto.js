const restful = require('node-restful')
const mongoose = restful.mongoose
mongoose.set('useFindAndModify', false);

const produtoSchema = new mongoose.Schema({ 
  codigo: { type: String, required: true }, 
  descricao: { type: String, required: true }, 
  categoria: { type: String, required: true },
  cor: { type: String, required: false },
  peso: { type: Number, required: false },
  valor: { type: Number, required: false },
  estoque: {
    u: Number,
    p: Number,
    pp: Number,
    m: Number,
    g: Number,
    gg: Number,
  }
})
module.exports = restful.model('Produto', produtoSchema)
