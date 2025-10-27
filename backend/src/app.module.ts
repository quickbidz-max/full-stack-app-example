import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entity/user.entity';
import { Product } from './product/entity/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'test_db',
      synchronize: true,
      logging: false,
      entities: [User, Product],
    }),
    AuthModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
