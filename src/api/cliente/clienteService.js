const Cliente = require('./cliente')
const errorHandler = require('../common/errorHandler')

Cliente.methods(['get', 'post', 'put', 'delete'])
Cliente.updateOptions({ new: true, runValidators: true })
Cliente.after('post', errorHandler).after('put', errorHandler)

module.exports = Cliente