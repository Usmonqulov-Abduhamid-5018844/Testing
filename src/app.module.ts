import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:Abduhamid@localhost:5432/testing',
      synchronize: true,
      autoLoadEntities: true,
      entities: [User],
    }),
    UserModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
