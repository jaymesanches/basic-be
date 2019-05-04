const express = require('express')
const auth = require('./auth')

module.exports = function (server) {

  /*      
   * Rotas protegidas por Token JWT    
   */
  const protectedApi = express.Router()
  server.use('/api', protectedApi)
  //protectedApi.use(auth)

  const Produto = require('../api/produto/produtoService')
  Produto.register(protectedApi, '/produtos')

  protectedApi.route('/produtos/update/:id').put(function (req, res) {
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
      })
        .catch(err => {
          res.status(400).send(`unable to update the database - ${err}`);
        });
    });
  });

  protectedApi.route('/produtos/search').get(function (req, res) {
    const regex = new RegExp(req.query.descricao, "i")
      , query = { descricao: regex };
    Produto.find(query, function (err, produto) {
      if (!produto) {
        console.log('ERRO', err, produto)
      } else {
        res.json(produto)
      }
    })
  })

  const Cliente = require('../api/cliente/clienteService')
  Cliente.register(protectedApi, '/clientes')

  protectedApi.route('/clientes/search').get(function (req, res) {
    const regex = new RegExp(req.query.nome, "i")
      , query = { nome: regex };
    Cliente.find(query, function (err, cliente) {
      if (!cliente) {
        console.log('ERRO', err, cliente)
      } else {
        res.json(cliente)
      }
    })
  });

  protectedApi.route('/clientes/update/:id').put(function (req, res) {
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
    });
  });

  const Orcamento = require('../api/orcamento/orcamentoService')
  const OrcamentoProduto = require('../api/orcamento/orcamentoProdutoService')
  Orcamento.register(protectedApi, '/orcamentos')

  protectedApi.route('/orcamentos/salvar').post(function (req, res) {
    OrcamentoProduto.insertMany(req.body.orcamentosProdutos)
      .then(itens => {
        const ids = itens.map(o => o._id);
        const data = Object.assign({}, req.body, { orcamentosProdutos: ids });
        const orcamento = new Orcamento(data);

        orcamento.save().then(() => {
          res.json('Orçamento incluído com sucesso.');
        }).catch(err => {
          res.status(400).send("Erro ao salvar o orçamento.");
        });
      })
  });

  protectedApi.route('/orcamentos/list').get(function (req, res) {
    Orcamento.find(function (err, cliente) {
      if (!cliente) {
        console.log('ERRO', err, cliente);
      } else {
        res.json(cliente);
      }
    }).populate('cliente');
  });

  protectedApi.route('/orcamentos/search/:id').get(function (req, res) {
    const id = req.params.id;
    console.log('ORC ID', id);

    if (id) {
      Orcamento.findOne({ _id: id }, function (err, orcamento) {
        if (!orcamento) {
          console.log('ERRO', err, orcamento);
        } else {
          console.log('BACK', orcamento);

          res.json(orcamento);
        }
      }).populate('cliente')
        .populate({
          path: 'orcamentosProdutos',
          populate: { path: 'produto' }
        });
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

  protectedApi.route('/orcamentos/findOne').post(function (req, res) {
    let obj = req.body;
    console.log('FINDONE', obj);
    
    Orcamento.findOne(obj, function (err, orcamento) {
      if (!orcamento) {
        console.log('ERRO', err, orcamentos);
      } else {
        res.json(orcamento);
      };
    }).populate('cliente')
      .populate({
        path: 'orcamentosProdutos',
        populate: { path: 'produto' }
      });
  });

  /*     
   * Rotas abertas     
   */
  const openApi = express.Router()
  server.use('/oapi', openApi)
  const AuthService = require('../api/user/authService')
  openApi.post('/login', AuthService.login)
  openApi.post('/signup', AuthService.signup)
  openApi.post('/validateToken', AuthService.validateToken)
}
