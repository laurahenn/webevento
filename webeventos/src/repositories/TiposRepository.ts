import { EntityRepository, Repository } from 'typeorm';

import Tipo from '../models/Tipo';

@EntityRepository(Tipo)
class TiposRepository extends Repository<Tipo> {

}

export default TiposRepository;
