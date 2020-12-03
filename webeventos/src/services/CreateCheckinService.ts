import { getRepository, Timestamp } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'
import Checkin from '../models/Checkin';

interface Request {
  data_hora: Date;
  sincronizado: boolean;
  usuario_evento_id: string;
}

class CreateCheckinService {
  public async execute({ data_hora, sincronizado, usuario_evento_id }: Request): Promise<Checkin>{
    const checkinsRepository = getRepository(Checkin);

    const checkin = checkinsRepository.create({ data_hora, sincronizado, usuario_evento_id });
    await checkinsRepository.save(checkin);

    return checkin;
  }
}

export default CreateCheckinService;
