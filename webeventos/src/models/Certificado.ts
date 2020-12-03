import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import Checkin from './Checkin';
import { id } from "date-fns/locale";

@Entity("certificado")
class Certificado {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  autenticacao: string;

  @Column()
  titulo: string;

  @Column()
  descricao: string;

  @Column()
  checkin_id: string;

  @Column()
  usuario_id: string;

  @ManyToOne(() => Checkin)
  @JoinColumn({ name: 'checkin_id' })
  checkin: Checkin;
}

export default Certificado;