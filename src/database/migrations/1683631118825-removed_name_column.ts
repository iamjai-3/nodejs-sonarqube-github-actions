import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedNameColumn1683631118825 implements MigrationInterface {
  name = 'RemovedNameColumn1683631118825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
  }
}
