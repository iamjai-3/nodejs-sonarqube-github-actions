import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedNewColumnName1683630489460 implements MigrationInterface {
  name = 'AddedNewColumnName1683630489460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
  }
}
