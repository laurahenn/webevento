import { getRepository } from 'typeorm'

import AppError from '../errors/AppError'
import Evento from '../models/Evento';

interface Request {
  nome: string;
  data: Date;
  hora_inicio: string;
  hora_fim: string;
  lugar: string;
  preco: string;
  status: boolean;
}

class CreateEventoService {
  public async execute({ nome, data, hora_inicio, hora_fim, lugar, preco, status }: Request): Promise<Evento>{
    const eventosRepository = getRepository(Evento);

    const evento = eventosRepository.create({ nome, data, hora_inicio, hora_fim, lugar, preco, status });
    await eventosRepository.save(evento);

    return evento;
  }
}

export default CreateEventoService;
