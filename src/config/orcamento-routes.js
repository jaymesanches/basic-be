const express = require('express');
const router = express.Router();
const Orcamento = require('../api/orcamento/orcamento-service');

router.route('/salvar').post(function (req, res) {
  const data = Object.assign({}, req.body, { orcamentosProdutos: req.body.orcamentosProdutos });
  const orcamento = new Orcamento(data);
  orcamento.save((err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

router.route('/').put(function (req, res) {
  const data = Object.assign({}, req.body, { orcamentosProdutos: req.body.orcamentosProdutos });
  const orcamento = new Orcamento(data);
  Orcamento.findOneAndUpdate({ _id: orcamento._id }, orcamento, { new: true, upsert: true }, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

router.route('/list').get(function (req, res) {
  Orcamento.find(function (err, cliente) {
    if (!cliente) {
      console.log('ERRO', err, cliente);
    } else {
      res.json(cliente);
    }
  }).populate('cliente').catch(err => {
    res.status(400).send(err);
  });
});

router.route('/search/:id').get(function (req, res) {
  const id = req.params.id;

  if (id) {
    Orcamento.findOne({ _id: id }, function (err, orcamento) {
      if (!orcamento) {
        console.log('ERRO', err, orcamento);
      } else {
        res.json(orcamento);
      }
    }).populate('cliente').populate('orcamentosProdutos.produto')
  } else {
    Orcamento.find(function (err, orcamentos) {
      if (!orcamentos) {
        console.log('ERRO', err, orcamentos);
      } else {
        res.json(orcamentos);
      };
    }).populate('cliente');
  };
});

router.route('/filter').post(function (req, res) {
  const obj = req.body;
  let situacao = req.body.situacao;

  if (situacao === 'TODAS' || !situacao) {
    delete obj.situacao;
  } else if (situacao === 'EXPIRADO') {
    obj.situacao = 'ABERTO';
    obj = [...obj, { situacao: 'ABERTO', dtaValidade: { $gt: new Date() } }];
  }

  Orcamento.find(obj, function (err, orcamentos) {
    if (!orcamentos) {
      console.log('ERRO', err, orcamentos);
      res.send(err);
    } else {
      res.json(orcamentos);
    };
  }).populate('cliente')
    .populate('orcamentosProdutos.produto')
});

module.exports = router;