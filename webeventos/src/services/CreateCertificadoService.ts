import { getRepository } from 'typeorm'

import Certificado from '../models/Certificado';

interface Request {
  autenticacao: string,
  titulo: string,
  descricao: string,
  checkin_id: string,
  usuario_id: string,
}

class CreateCertificadoService {
  public async execute({ autenticacao, titulo, descricao, checkin_id, usuario_id }: Request): Promise<Certificado>{
    const certificadosRepository = getRepository(Certificado);

    const certificado = certificadosRepository.create({ autenticacao, titulo, descricao, checkin_id, usuario_id });
    await certificadosRepository.save(certificado);

    return certificado;
  }
}

export default CreateCertificadoService;
