import { Router, json } from 'express';
import { getRepository } from 'typeorm'
import { getCustomRepository } from 'typeorm';

import CheckinsRepository from '../repositories/CheckinsRepository';
import CreateCheckinService from '../services/CreateCheckinService';

import UsersRepository from '../repositories/UsersRepository';
import EventosRepository from '../repositories/EventosRepository';
import UsuarioEventosRepository from '../repositories/UsuarioEventosRepository';

// Para gerar o certificado
import CreateCertificadoService from '../services/CreateCertificadoService';

// Para gerar o usuário
import CreateUserService from '../services/CreateUserService';

// Para gerar a inscricao 
import CreateUsuarioEventoService from '../services/CreateUsuarioEventoService';


import Mail from "../mail/mail";

import Usuario from '../models/Usuario'
import certificadosRouter from './certificado.routes';

const checkinsRouter = Router();

checkinsRouter.get('/', async (request, response) => {
  const checkinsRepository = getCustomRepository(CheckinsRepository);
  const checkins = await checkinsRepository.find();

  return response.json(checkins);
  // return response.json({ success: 'Sucesso lista' });
});

checkinsRouter.post('/', async (request, response) => {
  //   const { data_hora, sincronizado, usuario_evento_id } = request.body;
  const { usuario_login, evento_id } = request.body;

  // usuario pelo login
  const usersRepository = getCustomRepository(UsersRepository);
  const where = {};
   if (usuario_login) where.login = usuario_login;
   const user = await usersRepository.findOne({ where });  
   const usuario_id = user.id;

  // usuario-evento
  const usuarioEventosRepository = getCustomRepository(UsuarioEventosRepository);
  const where = {};
   if (evento_id) where.evento_id = evento_id;
   if (usuario_id) where.usuario_id = usuario_id;
  const usuario_evento = await usuarioEventosRepository.findOne({ where });  

  // informacoes para salvar
  const data_hora = new Date;
  const sincronizado = true;
  const usuario_evento_id = usuario_evento.id;

  const createCheckin = new CreateCheckinService();
  const checkin = await createCheckin.execute({ data_hora, sincronizado, usuario_evento_id });

  // enviando e-mail de Checkin para o usuário
  Mail.to = user.email;
  Mail.subject = 'Bom evento! [Checkin em Evento]';
  Mail.message = 'Aproveite o evento, seu Checking foi realizado. <br> Abraços';
  let result = Mail.sendMail();

  // const config = {
  //     "checkin_id" : checkin_id,
  // }
  // certificadosRouter.post('usuario-evento', config );

  return response.json(checkin);
});

// Check-in quando sincroniza
checkinsRouter.post('/sincroniza-checkin', async (request, response) => {

  const { array } = request.body;
  var i;

  // percorrendo array que vai receber
  for (i = 0; i < array.length; i++) 
  {

    const login     = array[i].login;
    const email     = array[i].email;
    const evento_id = array[i].evento_id;

    // busca usuario
    const usersRepository = getCustomRepository(UsersRepository);
    const where = {};
    where.login = login;
    const user_existe = await usersRepository.findOne({ where });  
    
    // busca evento
    const eventosRepository = getCustomRepository(EventosRepository);
    const where = {};
    where.id = evento_id;
    const evento = await eventosRepository.findOne({ where });  

    if(user_existe)   // usuario existe
    {
      const user          = user_existe;
      const usuario_id    = user.id;
      const usuario_email = user.email;

      // procura o usuario_evento = Inscrição
      const usuarioEventosRepository = getCustomRepository(UsuarioEventosRepository);
      const where = {};
      where.evento_id = evento_id;
      where.usuario_id = usuario_id;
      const usuarioevento = await usuarioEventosRepository.findOne({ where });  

      // Igual para User que Existe e Novo
      if(usuarioevento) {

        // Cria o check-in
        const data_hora = new Date;
        const sincronizado = true;
        const usuario_evento_id = usuarioevento.id;

        const createCheckin = new CreateCheckinService();
        const checkin = await createCheckin.execute({ data_hora, sincronizado, usuario_evento_id });
        
        if(checkin) 
        {
          // código do checkin criado
          const checkin_id = checkin.id;

          // enviando e-mail de Check-in para o usuário
          Mail.to = usuario_email;
          Mail.subject = 'Bom evento! [Checkin em Evento]';
          Mail.message = 'Aproveite o evento, seu Checking foi realizado. <br> Abraços';
          let result = Mail.sendMail();

          // CRIAR CERTIFICADO DA PROBLEMA!
          // Cria o Certificado
          const autenticacao = '';
          const titulo = "Presença no evento "+evento?.nome;
          const descricao = "Confirmamos que "+user?.nome+" participou do evento.";

          const createCertificado = new CreateCertificadoService();
          const certificado = await createCertificado.execute({ autenticacao, titulo, descricao, checkin_id, usuario_id });
  
          // // Gera PDF do Certificado
          // if(certificado)
          // {

          //   console.log('Criou Certificado - '+certificado);

          //   var pdf = require("html-pdf");
          //   var conteudo = `
          //       <h1 style='color:#b6d0e2'> Seu certificado </h1>
          //       <hr>
          //       <p>${certificado.titulo}</p>
          //       <p>${certificado.descricao}</p>
          //       <p>Chave: ${certificado.id}</p>
          //   `;
 
          //   pdf.create(conteudo, {}).toFile("src/pdf/certificado-"+certificado.id+".pdf"),(err, res) => {
          //     if(err){
          //         console.log("ERRO - PDF DO CERTIFICADO não FOI CRIADO");
          //     }
          //     else {
          //         console.log("SUCESSO - PDF DO CERTIFICADO FOI CRIADO");
          //     }
          //   } 
          // }
          
        }
        
      }

    }
    else              // usuario novo
    {
  
      // Criando Usuário
      const createUser = new CreateUserService();
      
      const nome_temporario = email.split("@"); // com base no email informado

      const nome = nome_temporario[0];
      const login = nome_temporario[0];
      const password = "123456"; // senha padrão
      const tipo_id = "330f89f4-541b-48c7-b2a7-09de71247851"; // código fixo

      const user = await createUser.execute({ nome, email, login, password, tipo_id });

      if(user) 
      {
        const usuario_id    = user.id;
        const usuario_email = user.email;

        // enviando e-mail de Novo usuário, com informações para login
        Mail.to = usuario_email;
        Mail.subject = 'Bem vindo ao Web-Evento [Novo Usuário]';
        Mail.message = 'Adoramos te ver aqui, esperamos que curta muitos eventos. <br><br> Você já chegou com tudo, <b>gostamos!</b><br>Criamos seu usuário com base no e-mail que informou na entrada do evento <b>'+evento?.nome+'</b>, segue informações para que acesse sua conta e altere as informações do seu perfil como preferir.<br><br> <b>Login:</b> '+login+' <br> <b>Senha:</b> '+password+' <br><br>Aproveite muito, abraços!';
        let result_user = Mail.sendMail();

        // Criando Inscrição
        const nome = evento?.nome;
        const data = evento?.data;
        const hora_inicio = evento?.hora_inicio;

        const createUsuarioEvento = new CreateUsuarioEventoService();
        const usuarioevento = await createUsuarioEvento.execute({ usuario_id, evento_id, nome, data, hora_inicio });

        // Igual para User que Existe e Novo
        if(usuarioevento) {

          // enviando e-mail de Inscrição no Evento para o usuário
          Mail.to = usuario_email;
          Mail.subject = 'Hmm vai rolar Evento [Inscrição para participação]';
          Mail.message = 'Ficamos felizes por você encontrar um evento para você, logo mais chega o dia de participar. <br>Aproveite muito, abraços';
          let result_inscricao = Mail.sendMail();

          // Cria o check-in
          const data_hora = new Date;
          const sincronizado = true;
          const usuario_evento_id = usuarioevento.id;

          const createCheckin = new CreateCheckinService();
          const checkin = await createCheckin.execute({ data_hora, sincronizado, usuario_evento_id });
          
          if(checkin) 
          {
  
            // código do checkin criado
            const checkin_id = checkin.id;

            // enviando e-mail de Check-in para o usuário
            Mail.to = usuario_email;
            Mail.subject = 'Bom evento! [Checkin em Evento]';
            Mail.message = 'Aproveite o evento, seu Checking foi realizado. <br> Abraços';
            let result_checkin = Mail.sendMail();

            // CRIAR CERTIFICADO DA PROBLEMA
            // Cria o Certificado
            const autenticacao = '';
            const titulo = "Presença no evento "+evento?.nome;
            const descricao = "Confirmamos que "+user?.nome+" participou do evento.";

            const createCertificado = new CreateCertificadoService();
            const certificado = await createCertificado.execute({ autenticacao, titulo, descricao, checkin_id, usuario_id });
 
            // // Gera PDF do Certificado
            // if(certificadoN)
            // {
            //   console.log('Certificado criado - '+certificadoN);

            //   var pdf = require("html-pdf");
            //   var conteudo = `
            //       <h1 style='color:#b6d0e2'> Seu certificado </h1>
            //       <hr>
            //       <p>${certificado.titulo}</p>
            //       <p>${certificado.descricao}</p>
            //       <p>Chave: ${certificado.id}</p>
            //   `;

            //   pdf.create(conteudo, {}).toFile("src/pdf/certificado-"+certificado.id+".pdf"),(err, res) => {
            //     if(err){
            //         console.log("ERRO - PDF DO CERTIFICADO não FOI CRIADO");
            //     }
            //     else {
            //         console.log("SUCESSO - PDF DO CERTIFICADO FOI CRIADO");
            //     }
            //   } 
            // }
             
          }
        }
      }

    }

  }

  return response.json('Sucesso');
});

export default checkinsRouter;
