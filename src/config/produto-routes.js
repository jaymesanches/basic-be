const express = require('express');
const router = express.Router();
const Produto = require('../api/produto/produto-service');

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
      res.status(400).send(`Erro ao atualizar o produto - ${err}`);
    });
  });
});

router.route('/baixar-estoque').post(function (req, res) {
  const produtos = req.body.orcamentosProdutos;
  const opts = { runValidators: true, new: true };
  
  produtos.forEach(op => {
    const where = { _id: op.produto };

    Produto.findOne(where, (err, produto) => {
      if(err){
        res.status(500).json({'error': 'Erro ao baixar estoque'});
      } else {
        const update = { $inc: { ['estoque.'  + op.tamanho] : -op.quantidade } };

        if (produto.estoque[op.tamanho] - op.quantidade < 0) {
          res.status(200).json({ 'error': 'Estoque insuficiente' });
        } else {
          Produto.updateOne(where, update, opts, (err, result) => {
            if(err){
              res.status(500).json({'error': 'Erro ao baixar estoque'});
            }
          });
        }
      }
    });
  });
});

router.route('/update-all').post(function (req, res){
  const produtos = req.body;

  produtos.forEach(produto =>{
    Produto.findOneAndUpdate({_id: produto._id}, produto, (err, result) => {
      if(err){
        res.status(500).json({'error': 'Erro ao atualizar produto'});
      }
    });
  });

  res.json({'success': 'Produtos atualizados com sucesso.'});
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