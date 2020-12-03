import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import EventosRepository from '../repositories/EventosRepository';
import CreateEventoService from '../services/CreateEventoService';
import UsuarioEventosRepository from '../repositories/UsuarioEventosRepository';


const eventosRouter = Router();

eventosRouter.get('/', async (request, response) => {
  const eventosRepository = getCustomRepository(EventosRepository);
  const eventos = await eventosRepository.find();

  return response.json(eventos);
  // return response.json({ success: 'Sucesso lista' });
});

// Lista os eventos de um determinado dia
eventosRouter.get('/eventos-dia', async (request, response) => {

  // const { ano, mes, dia, nome } = request.body;
  const { ano, mes, dia, nome } = request.query;

  const eventosRepository = getCustomRepository(EventosRepository); 

  const where = {};
   if (nome) where.nome = nome;
   if (ano) where.data = ano+"-"+mes+"-"+dia+"T03:00:00.000Z";

   const eventos = await eventosRepository.find({
     where,
   });  
            
  return response.json(eventos);
});

eventosRouter.post('/', async (request, response) => {
  const { nome, data, hora_inicio, hora_fim, lugar, preco, status } = request.body;

  const createEvento = new CreateEventoService();
  const evento = await createEvento.execute({ nome, data, hora_inicio, hora_fim, lugar, preco, status });

  return response.json(evento);
});

export default eventosRouter;
