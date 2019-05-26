const express = require('express');
const auth = require('./auth');
const produtoRoutes = require('./produto-routes');
const clienteRoutes = require('./cliente-routes');
const orcamentoRoutes = require('./orcamento-routes');

const server = function (server) {

  /*      
   * Rotas protegidas por Token JWT    
   */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);
  //protectedApi.use(auth);

  const Produto = require('../api/produto/produtoService');
  Produto.register(protectedApi, '/produtos');
  protectedApi.use('/produtos', produtoRoutes);
  
  const Cliente = require('../api/cliente/clienteService');
  Cliente.register(protectedApi, '/clientes');
  protectedApi.use('/clientes', clienteRoutes);

  const Orcamento = require('../api/orcamento/orcamentoService');
  Orcamento.register(protectedApi, '/orcamentos');
  protectedApi.use('/orcamentos', orcamentoRoutes);

  /*     
   * Rotas abertas     
   */
  const openApi = express.Router();
  server.use('/oapi', openApi);
  const AuthService = require('../api/user/authService');
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
  openApi.post('/validateToken', AuthService.validateToken);
}

module.exports = server;