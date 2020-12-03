import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import Tipo from '../models/Tipo';

@Entity("usuario")
class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  tipo_id: string;

  @ManyToOne(() => Tipo)
  @JoinColumn({ name: 'tipo_id' })
  tipo: Tipo;

}

export default Usuario;
