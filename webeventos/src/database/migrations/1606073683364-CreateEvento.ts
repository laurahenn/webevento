import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateEvento1606073683364 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "evento",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: "nome",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "data",
              type: "date",
              isNullable: false,
              default: "now()",
            },
            {
              name: "hora_inicio",
              type: "time",
              isNullable: false,
            },
            {
              name: "hora_fim",
              type: "time",
              isNullable: false,
            },
            {
              name: "lugar",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "preco",
              type: "float",
              isNullable: true,
            },
            {
              name: "status",
              type: "boolean",
              default: true,
              isNullable: false,
            },
          ],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("evento");
    }
  }
  