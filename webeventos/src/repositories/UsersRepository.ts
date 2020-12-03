import { EntityRepository, Repository } from 'typeorm';

import Usuario from '../models/Usuario';

@EntityRepository(Usuario)
class UsersRepository extends Repository<Usuario> {

}

export default UsersRepository;
