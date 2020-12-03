import { getRepository, Timestamp } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'
import Tipo from '../models/Tipo';

interface Request {
  descricao: string;
  promoter: boolean;
  participante: boolean;
}

class CreateTipoService {
  public async execute({ descricao, promoter, participante }: Request): Promise<Tipo>{
    const tiposRepository = getRepository(Tipo);

    const tipo = tiposRepository.create({ descricao, promoter, participante });
    await tiposRepository.save(tipo);

    return tipo;
  }
}

export default CreateTipoService;
