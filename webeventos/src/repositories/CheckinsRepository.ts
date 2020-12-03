import { EntityRepository, Repository } from 'typeorm';

import Checkin from '../models/Checkin';

@EntityRepository(Checkin)
class CheckinsRepository extends Repository<Checkin> {

}

export default CheckinsRepository;