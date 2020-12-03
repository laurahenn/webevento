import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTipo1606073667712 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "tipo",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: "descricao",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "promoter",
              type: "boolean",
              default: false,
              isNullable: false,
            },
            {
              name: "participante",
              type: "boolean",
              default: false,
              isNullable: false,
            },
          ],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("tipo");
    }
  }
  