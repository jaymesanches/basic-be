const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Usuario = require('./usuario')
const env = require('../../.env')
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

const login = (req, res, next) => {
  const email = req.body.email || ''
  const senha = req.body.senha || ''
  Usuario.findOne({ email }, (err, usuario) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
      const token = jwt.sign({ ...usuario }, env.authSecret, { expiresIn: "1 day" })
      const { nome, email } = usuario
      res.json({ nome, email, token })
    } else {
      return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
    }
  })
}

const validateToken = (req, res, next) => {
  const token = req.body.token || ''
  jwt.verify(token, env.authSecret, function (err, decoded) {
    return res.status(200).send({ valid: !err })
  })
}

const signup = (req, res, next) => {
  const nome = req.body.nome || ''
  const email = req.body.email || ''
  const senha = req.body.senha || ''
  const confirmarSenha = req.body.confirmar_senha || ''
  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informa está inválido'] })
  }

  if (!senha.match(passwordRegex)) {
    return res.status(400).send({ errors: ["Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20."] })
  }
  const salt = bcrypt.genSaltSync()
  const senhaHash = bcrypt.hashSync(password, salt)
  if (!bcrypt.compareSync(confirmarSenha, senhaHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem.'] })
  }
  Usuario.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
    } else {
      const novoUsuario = new Usuario({ nome, email, senhaHash })
      novoUsuario.save(err => {
        if (err) {
          return sendErrorsFromDB(res, err)
        } else {
          login(req, res, next)
        }
      })
    }
  })
}

module.exports = { login, signup, validateToken }



