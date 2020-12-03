import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TiposRepository from '../repositories/TiposRepository';
import CreateTipoService from '../services/CreateTipoService';

const tiposRouter = Router();

tiposRouter.get('/', async (request, response) => {
  const tiposRepository = getCustomRepository(TiposRepository);
  const tipos = await tiposRepository.find();

  return response.json(tipos);
  // return response.json({ success: 'Sucesso lista' });
});

tiposRouter.post('/', async (request, response) => {
  const { descricao, promoter, participante } = request.body;

  const createTipo = new CreateTipoService();

  const tipo = await createTipo.execute({ descricao, promoter, participante });

  return response.json(tipo);
});

export default tiposRouter;
