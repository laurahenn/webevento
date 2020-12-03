import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsuarioEvento1606073700869 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "usuario_evento",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'usuario_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'evento_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: "nome",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "data",
              type: "date",
              isNullable: true,
              default: "now()",
            },
            {
              name: "hora_inicio",
              type: "time",
              isNullable: true,
            },
          ],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("usuario_evento");
    }
  }
  