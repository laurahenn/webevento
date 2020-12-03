import { Router } from 'express';
import { getCustomRepository, ObjectID } from 'typeorm';

import UsuarioEventosRepository from '../repositories/UsuarioEventosRepository';
import CreateUsuarioEventoService from '../services/CreateUsuarioEventoService';
import UsuarioEvento from '../models/UsuarioEvento';
import UsersRepository from '../repositories/UsersRepository';
import EventosRepository from '../repositories/EventosRepository';

import Mail from "../mail/mail";

const usuarioeventosRouter = Router();

usuarioeventosRouter.get('/', async (request, response) => {
  const usuarioeventosRepository = getCustomRepository(UsuarioEventosRepository);
  const usuarioeventos = await usuarioeventosRepository.find();

  return response.json(usuarioeventos);
  // return response.json({ success: 'Sucesso lista' });
});

// Inscrever-se
usuarioeventosRouter.post('/', async (request, response) => {
  const { usuario_id, evento_id } = request.body;

  const usuarioeventosRepository = getCustomRepository(UsuarioEventosRepository);

  const where = {};
  if (usuario_id) where.usuario_id = usuario_id;
  if (evento_id) where.evento_id = evento_id;
    const tem = await usuarioeventosRepository.findOne({ where });

    // Só inscreve se não tiver inscrito
  if(!tem)
  {
    const usersRepository = getCustomRepository(UsersRepository);
    const where = {};
    if (usuario_id) where.id = usuario_id;
    const user = await usersRepository.findOne({ where });  

    
    const eventosRepository = getCustomRepository(EventosRepository);
    const where = {};
    if (evento_id) where.id = evento_id;
    const evento = await eventosRepository.findOne({ where });  
    const nome = evento.nome;
    const data = evento.data;
    const hora_inicio = evento.hora_inicio;

    const createUsuarioEvento = new CreateUsuarioEventoService();
    const usuarioevento = await createUsuarioEvento.execute({ usuario_id, evento_id, nome, data, hora_inicio });

    // enviando e-mail de Inscrição no Evento para o usuário
    Mail.to = user.email;
    Mail.subject = 'Hmm vai rolar Evento [Inscrição para participação]';
    Mail.message = 'Ficamos felizes por você encontrar um evento para você, logo mais chega o dia de participar. <br>Aproveite muito, abraços';
    let result = Mail.sendMail();

    return response.json(usuarioevento);
  }
  else {
   return response.status(200).json({ message: "Você já esta inscrito nesse evento" });    
  }
});

// Cancelar a inscricao
usuarioeventosRouter.delete('/', async (request, response) => {
  const { usuario_id, evento_id } = request.body;

  const usersRepository = getCustomRepository(UsersRepository);
  
  const where = {};
   if (usuario_id) where.id = usuario_id;
   const user = await usersRepository.findOne({ where });  
   const email_usuario = user.email;

  const usuarioeventosRepository = getCustomRepository(UsuarioEventosRepository);

  const where = {};
   if (usuario_id) where.usuario_id = usuario_id;
   if (evento_id) where.evento_id = evento_id;

  await usuarioeventosRepository.delete(where);

  // enviando e-mail de Cancelamento no Evento para o usuário
  Mail.to = email_usuario;
  Mail.subject = 'Que pena! [Cancelamento de participação]';
  Mail.message = 'Lamentamos você não poder participar do evento, esperamos que encontre outros eventos e participe. <br>Até mais, abraços';
  let result = Mail.sendMail();

  return response.json({ success: 'Inscrição Cancelada' });

});

// Filtro só os de um Usuário
  // console.log("select e.* from evento e where e.id in (select ue.evento_id from usuario_evento ue where ue.usuario_id = '"+usuario_id+"')");
usuarioeventosRouter.get('/usuario', async (request, response) => {

  const { usuario_id } = request.query;

  // usuário no evento [inscrito]
  const usuarioeventosRepository = getCustomRepository(UsuarioEventosRepository);

  const where = {};
   if (usuario_id) where.usuario_id = usuario_id;

  const usuario_eventos = await usuarioeventosRepository.find({ where });  

  console.log(usuario_id);

  return response.json(usuario_eventos);
});

export default usuarioeventosRouter;
