import { EntityRepository, Repository } from 'typeorm';

import Certificado from '../models/Certificado';

@EntityRepository(Certificado)
class CertificadosRepository extends Repository<Certificado> {

}

export default CertificadosRepository;
