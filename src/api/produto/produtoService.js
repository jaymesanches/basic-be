const Produto = require('./produto')
const errorHandler = require('../common/errorHandler')

Produto.methods(['get', 'post', 'put', 'delete'])
Produto.updateOptions({ new: true, runValidators: true })
Produto.after('post', errorHandler).after('put', errorHandler)

module.exports = Produto