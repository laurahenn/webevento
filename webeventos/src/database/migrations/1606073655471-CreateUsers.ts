import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1606073655471 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "usuario",
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
                name: "email",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "login",
                type: "varchar",
                isNullable: false,
                isUnique: true,
              },
              {
                name: "password",
                type: "varchar",
                isNullable: false,
              },
              {
                name: "status",
                type: "boolean",
                default: true,
                isNullable: false,
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "now()",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "now()",
              },
              {
                name: 'tipo_id',
                type: 'uuid',
                isNullable: false,
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("usuario");
      }
}
    