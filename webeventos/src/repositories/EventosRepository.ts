import { EntityRepository, Repository } from 'typeorm';

import Evento from '../models/Evento';

@EntityRepository(Evento)
class EventosRepository extends Repository<Evento> {

}

export default EventosRepository;
