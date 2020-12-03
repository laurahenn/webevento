import { getRepository, Timestamp } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'
import UsuarioEvento from '../models/UsuarioEvento';

interface Request {
  usuario_id: string;
  evento_id: string;
  nome: string;
  data: string;
  hora_inicio: string;
}

class CreateUsuarioEventoService {
  public async execute({ usuario_id, evento_id, nome, data, hora_inicio }: Request): Promise<UsuarioEvento>{
    const usuarioeventosRepository = getRepository(UsuarioEvento);

    const usuarioevento = usuarioeventosRepository.create({ usuario_id, evento_id, nome, data, hora_inicio });
    await usuarioeventosRepository.save(usuarioevento);

    return usuarioevento;
  }
}

export default CreateUsuarioEventoService;
