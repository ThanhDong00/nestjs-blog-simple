import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import 'dotenv/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASS,
      database: 'nestjs_db1',
      autoLoadModels: true,
      synchronize: true, // Best practice: FALSE trong production
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
