import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config';

export const dbConnection: DataSourceOptions = {
  type: 'postgres',
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [`${__dirname}/entities/*{.ts,.js}`],
  migrations: [`${__dirname}/database/migrations/*{.ts,.js}`],
  subscribers: [`${__dirname}/subscriber/*{.ts,.js}`],
};

export const AppDataSource = new DataSource(dbConnection);
