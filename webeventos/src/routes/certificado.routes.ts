import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CertificadosRepository from '../repositories/CertificadosRepository';
import CreateCertificadoService from '../services/CreateCertificadoService';

import UsersRepository from '../repositories/UsersRepository';
import EventosRepository from '../repositories/EventosRepository';
import CheckinsRepository from '../repositories/CheckinsRepository';
import UsuarioEventosRepository from '../repositories/UsuarioEventosRepository';
import Certificado from '../models/Certificado';

const certificadosRouter = Router();

certificadosRouter.get('/', async (request, response) => {
  const certificadosRepository = getCustomRepository(CertificadosRepository);
  const certificados = await certificadosRepository.find();

  return response.json(certificados);
});

// A PARTIR DO CHECKIN
certificadosRouter.post('/', async (request, response) => {
  // const { autenticacao, titulo, descricao, checkin_id, usuario_id } = request.body;
  const { checkin_id } = request.body;
 
  // CHECKIN
  const checkinsRepository = getCustomRepository(CheckinsRepository);
  const where = {};
   if (evento_id) where.id = evento_id;
   if (usuario_id) where.id = usuario_id;
  const checkin = await checkinsRepository.findOne({ where });  

  const usuario_id = checkin.usuario_id;
  const usuario_evento_id = checkin.usuario_evento_id;

  // USUARIO EVENTO 
  const usuarioEventosRepository = getCustomRepository(UsuarioEventosRepository);
  const where = {};
   if (usuario_evento_id) where.id = usuario_evento_id;
  const usuario_evento = await usuarioEventosRepository.findOne({ where });  

  const evento_id = usuario_evento.evento_id;

  // USUARIO
  const usersRepository = getCustomRepository(UsersRepository);
    const where = {};
    if (usuario_id) where.id = usuario_id;
    const user = await usersRepository.findOne({ where });  

  // EVENTO
  const eventosRepository = getCustomRepository(EventosRepository);
    const where = {};
     if (evento_id) where.id = evento_id;
    const evento = await eventosRepository.findOne({ where }); 
    
  // INFORMACOES PARA SALVAR
  const autenticacao = 'AU';
  const titulo = "Presença no evento "+evento.nome;
 // const descricao = "Confirmamos que você participou do evento.";
  const descricao = "Confirmamos que "+user.nome+" participou do evento.";
  const usuario_id = user.id;

  const createCertificado = new CreateCertificadoService();
  const certificado = await createCertificado.execute({ autenticacao, titulo, descricao, checkin_id, usuario_id });

  return response.json(certificado);
});

// Certificados de um usuário
certificadosRouter.get('/usuario', async (request, response) => {
  
  const { usuario_id } = request.query;

  const certificadosRepository = getCustomRepository(CertificadosRepository);

  const where = {};
   if (usuario_id) where.usuario_id = usuario_id;

  const certificados = await certificadosRepository.find({ where });  

  return response.json(certificados);
});

certificadosRouter.post('/arquivo', async (request, response) => {

  const { id } = request.body;
  const certificadosRepository = getCustomRepository(CertificadosRepository);
  const where = {};
   if (id) where.id = id;

  const certificado = await certificadosRepository.findOne({ where });  

  // criando um pdf
  var fs = require('fs');
  var pdf = require("html-pdf");
  var conteudo = `
      <h1 style='color:#b6d0e2'> Seu certificado </h1>
      <hr>
      <p>${certificado?.titulo}</p>
      <p>${certificado?.descricao}</p>

      <p>Chave: ${certificado?.id}</p>
  `;

  pdf.create(conteudo, {}).toFile("src/pdf/certificado-"+certificado?.id+".pdf"),(err, res) => {
      if(err){
          console.log("DEU ERRO");
      }
      else {
          console.log(res);
          var stream = fs.createReadStream('http://177.44.248.91:3000/');
          var filename = "certificado-"+certificado?.id+".pdf"; 
          response.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
          response.setHeader('Content-type', 'application/pdf');
          stream.pipe(response);
      }
  }
  return response.json(certificado);
});


// Valida certificado
certificadosRouter.get('/validar', async (request, response) => {
  const { chave } = request.body;

  const certificadosRepository = getCustomRepository(CertificadosRepository);

  const where = {};
   if (chave) where.id = chave;

  const certificado = await certificadosRepository.findOne({ where }); 
  
  if(certificado) {

    return response.json(certificado);
  }
  else {
    return response.status(500).json({
      status: 'error',
      message: 'Certificado não encontrado',
    });
  }

});

// Funciona para criar PDF
certificadosRouter.get("/gera-pdf", async (request, response) => {

  // Informações com base no Certificado 
  const { id } = request.body;

  const certificadosRepository = getCustomRepository(CertificadosRepository);
  const where = {};
   if (id) where.id = id;

  const certificado = await certificadosRepository.findOne({ where });  

  var conteudo = ` 
      Seu certificado de participação do Evento

      ${certificado?.titulo}
      ${certificado?.descricao}

      Chave: ${certificado?.id}
  `;

  // Gerando PDF
  const fs = require('fs');

  const PDFDocument = require('pdfkit');

  const doc = new PDFDocument; // Criando PDF

  doc.pipe(fs.createWriteStream("src/pdf/certificado-"+certificado?.id+".pdf"));

  // Add another page
  doc.text(conteudo, 100, 100);
  
  doc.end(); // Finaliza o PDF

  return response.json('PDF Gerado com sucesso');

});

// Tenta abrir o PDF - não funcionou
certificadosRouter.get("/abre-pdf", async (request, response) => {

  // Informações com base no Certificado 
  const { id } = request.body;

  const PDFDocument = require('pdfkit');
  const blobStream  = require('blob-stream');
  const fs = require('fs');

  var stream = fs.createReadStream('http://177.44.248.91:3000/');
  var filename = "certificado-"+id+".pdf"; 

  response.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  response.setHeader('Content-type', 'application/pdf');
  stream.pipe(response);

  return response.json('PDF Gerado com sucesso');
});




export default certificadosRouter;
