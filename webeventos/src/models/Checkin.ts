import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import UsuarioEvento from '../models/UsuarioEvento';
import { id } from "date-fns/locale";

@Entity("checkin")
class Checkin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  data_hora: Date;

  @Column()
  sincronizado: boolean;

  @Column()
  usuario_evento_id: string;

  @ManyToOne(() => UsuarioEvento)
  @JoinColumn({ name: 'usuario_evento_id' })
  user: UsuarioEvento;
}

export default Checkin;
