const restful = require('node-restful')
const mongoose = restful.mongoose
// const moment = require('moment-timezone')
const AutoIncrement = require('mongoose-sequence')(mongoose)

// const tz = 'America/Sao_Paulo'
// moment.tz(tz).format()

const orcamentoProdutoSchema = new mongoose.Schema({ 
  quantidade: { type: Number, required: true }, 
  vlrUnitario: { type: Number, required: true }, 
  tamanho: { type: String, required: true, uppercase: true, trim: true },
  produto: {type: mongoose.Schema.Types.ObjectId, ref: 'Produto'}
});

const orcamentoSchema = new mongoose.Schema({
  numero: { type: Number, required: false },
  vlrTotal: { type: Number, required: false },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  dtaCriacao: { type: Date, default: Date.now },
  dtaValidade: { type: Date },
  situacao: { type: String, default: 'ABERTO' },
  orcamentosProdutos: [orcamentoProdutoSchema]
})

orcamentoSchema.plugin(AutoIncrement, { inc_field: 'numero' });
module.exports = restful.model('Orcamento', orcamentoSchema)
