import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class AlterAdicionandoForeignKeys1606073728592 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createForeignKey(
          'usuario',
          new TableForeignKey({
            columnNames: ['tipo_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tipo',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
  
        await queryRunner.createForeignKey(
          'certificado',
          new TableForeignKey({
            columnNames: ['checkin_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'checkin',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
        await queryRunner.createForeignKey(
          'certificado',
          new TableForeignKey({
            columnNames: ['usuario_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
  
        await queryRunner.createForeignKey(
          'usuario_evento',
          new TableForeignKey({
            columnNames: ['usuario_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
  
        await queryRunner.createForeignKey(
          'usuario_evento',
          new TableForeignKey({
            columnNames: ['evento_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'evento',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
  
        await queryRunner.createForeignKey(
          'checkin',
          new TableForeignKey({
            columnNames: ['usuario_evento_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario_evento',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }),
        );
  
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
      }
  
  }
  