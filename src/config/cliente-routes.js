const express = require('express');
const router = express.Router();
const Cliente = require('../api/cliente/clienteService');

router.route('/search').get(function (req, res) {
  const regex = new RegExp('.*' + req.query.nome + '.*', "i")
    , query = { nome: regex };
  Cliente.find(query, function (err, clientes) {
    if (!clientes) {
      console.log('ERRO', err, clientes)
    } else {
      res.json(clientes)
    }
  }).catch(err => {
    res.status(400).send(err);
  });
});

router.route('/update/:id').put(function (req, res) {
  Cliente.findById(req.params.id, function (err, cliente) {
    if (!cliente)
      console.log('ERRO', err, cliente)
    else {
      cliente.codigo = req.body.codigo;
      cliente.nome = req.body.nome;
      cliente.email = req.body.email;
      cliente.cnpj = req.body.cnpj;

      cliente.save().then(cliente => {
        res.json('Update complete');
      }).catch(err => {
        res.status(400).send("unable to update the database");
      });
    }
  }).catch(err => {
    res.status(400).send(err);
  });
});

module.exports = router;