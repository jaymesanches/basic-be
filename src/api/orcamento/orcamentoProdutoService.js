const OrcamentoProduto = require('./orcamentoProduto')
const errorHandler = require('../common/errorHandler')

OrcamentoProduto.methods(['get', 'post', 'put', 'delete'])
OrcamentoProduto.updateOptions({ new: true, runValidators: true })
OrcamentoProduto.after('post', errorHandler).after('put', errorHandler)

module.exports = OrcamentoProduto