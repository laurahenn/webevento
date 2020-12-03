import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("tipo")
class Tipo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  descricao: string;

  @Column()
  promoter: boolean;

  @Column()
  participante: boolean;
}

export default Tipo;
