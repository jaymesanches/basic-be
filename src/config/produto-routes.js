const express = require('express');
const router = express.Router();
const Produto = require('../api/produto/produtoService');

router.route('/update/:id').put(function (req, res) {
  Produto.findById(req.params.id, function (err, produto) {
    produto.codigo = req.body.codigo;
    produto.descricao = req.body.descricao;
    produto.tamanho = req.body.tamanho;
    produto.categoria = req.body.categoria;
    produto.peso = req.body.peso;
    produto.cor = req.body.cor;
    produto.valor = req.body.valor;
    produto.estoque = req.body.estoque;

    produto.save().then(produto => {
      res.json('Produto atualizado com sucesso.');
    }).catch(err => {
      res.status(400).send(`unable to update the database - ${err}`);
    });
  });
});

router.route('/search').get(function (req, res) {
  const regex = new RegExp(req.query.descricao, "i"), query = { descricao: regex };

  const q = Produto.find(query);
  q.exec((err, docs) => {
    if (err) {
      console.log('ERRO', err);
      res.status(400).send(err);
    }

    res.json(docs);
  });
});

module.exports = router;