import { EntityRepository, Repository } from 'typeorm';

import UsuarioEvento from '../models/UsuarioEvento';

@EntityRepository(UsuarioEvento)
class UsuarioEventosRepository extends Repository<UsuarioEvento> {

}

export default UsuarioEventosRepository;