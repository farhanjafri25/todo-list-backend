import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  backend_tasks_farhan,
  UserTodoList,
} from './entities/Todo-list.entity';
import { AppRepository } from './app.repository';
import { RedisService } from './redis.service';
import { myGateway } from './socket/socket';
import { GatewayModule } from './socket/socket.module';
// import { SocketModule } from './socket/socket.module';
// import { myGateway } from './socket/socket';
import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = path.join(
  process.cwd(),
  process.env.NODE_ENV ? `envs/.env.${process.env.NODE_ENV}` : `/.env`,
);
dotenv.config({
  path: envPath,
});
console.log(process.env.MONGO_URI);

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    MongooseModule.forFeature([
      { name: backend_tasks_farhan.name, schema: UserTodoList },
    ]),
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository, RedisService, myGateway],
})
export class AppModule {}
