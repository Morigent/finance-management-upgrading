import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

loadEnv();

const parseBoolean = (value: string | undefined): boolean =>
  value === 'true' || value === '1';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'finance_management',
  entities: [Category, Transaction],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
  logging: parseBoolean(process.env.DB_LOGGING),
  charset: 'utf8mb4_unicode_ci',
  timezone: 'Z',
  dateStrings: ['DATE'],
});

export default AppDataSource;
