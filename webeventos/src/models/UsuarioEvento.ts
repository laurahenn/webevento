import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import Usuario from '../models/Usuario';
import Evento from '../models/Evento';
import { id } from "date-fns/locale";

@Entity("usuario_evento")
class UsuarioEvento {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  usuario_id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  evento_id: string;

  @Column()
  nome: string;

  @Column()
  data: string;

  @Column()
  hora_inicio: string;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;
}

export default UsuarioEvento;
