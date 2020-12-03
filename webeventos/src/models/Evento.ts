import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("evento")
class Evento {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nome: string;

  @Column()
  data: Date;

  @Column()
  hora_inicio: string;

  @Column()
  hora_fim: string;

  @Column()
  lugar: string;

  @Column()
  preco: string;

  @Column()
  status: boolean;
}

export default Evento;
