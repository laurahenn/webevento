import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCertificado1606073676376 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "certificado",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: "autenticacao",
              type: "varchar",
              isNullable: false,
              isUnique: true,
            },
            {
              name: "titulo",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "descricao",
              type: "varchar",
              isNullable: true,
            },
            {
              name: 'checkin_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'usuario_id',
              type: 'uuid',
              isNullable: false,
            },
          ],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("certificado");
    }
  }
  