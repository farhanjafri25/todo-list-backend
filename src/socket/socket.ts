import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { createServer } from 'http';
import { Server } from 'socket.io';

@WebSocketGateway()
export class myGateway implements OnModuleInit {
  httpServer = createServer();
  io = new Server(this.httpServer);

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('add')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit(body);
  }
}
