import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFinanceTables1795219200000 implements MigrationInterface {
  name = 'CreateFinanceTables1795219200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`categories\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`type\` ENUM('income', 'expense') NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_categories_name_type\` (\`name\`, \`type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE \`transactions\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(150) NOT NULL,
        \`amount\` DECIMAL(12,2) NOT NULL,
        \`type\` ENUM('income', 'expense') NOT NULL,
        \`description\` TEXT NULL,
        \`transaction_date\` DATE NOT NULL,
        \`category_id\` INT NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_transactions_transaction_date\` (\`transaction_date\`),
        KEY \`idx_transactions_category_id\` (\`category_id\`),
        KEY \`idx_transactions_type\` (\`type\`),
        KEY \`idx_transactions_type_date\` (\`type\`, \`transaction_date\`),
        CONSTRAINT \`chk_transactions_amount_positive\` CHECK (\`amount\` > 0),
        CONSTRAINT \`fk_transactions_category\` FOREIGN KEY (\`category_id\`)
          REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `transactions`');
    await queryRunner.query('DROP TABLE IF EXISTS `categories`');
  }
}
