const restful = require('node-restful')
const mongoose = restful.mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orcamentoSchema = new mongoose.Schema({ 
  numero: { type: Number, required: false },
  vlrTotal: { type: Number, required: false },
  cliente: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'},
  orcamentosProdutos: [{type: mongoose.Schema.Types.ObjectId, ref: 'OrcamentoProduto'}]
})

orcamentoSchema.plugin(AutoIncrement, {inc_field: 'numero'});
module.exports = restful.model('Orcamento', orcamentoSchema)
