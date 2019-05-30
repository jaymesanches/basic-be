const Orcamento = require('./orcamento')
const errorHandler = require('../common/errorHandler')

Orcamento.methods(['get', 'post', 'put', 'delete'])
Orcamento.updateOptions({ new: true, runValidators: true })
Orcamento.after('post', errorHandler).after('put', errorHandler)

module.exports = Orcamento