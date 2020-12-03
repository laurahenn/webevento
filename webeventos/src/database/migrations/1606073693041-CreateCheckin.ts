import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCheckin1606073693041 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "checkin",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: "data_hora",
              type: "date",
              isNullable: false,
              default: "now()",
            },
            {
              name: 'usuario_evento_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: "sincronizado",
              type: "boolean",
              default: true,
              isNullable: false,
            },
          ],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("checkin");
    }
  }
  