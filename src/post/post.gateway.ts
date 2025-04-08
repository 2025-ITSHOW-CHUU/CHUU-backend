import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PostGateway {
  @WebSocketServer()
  server: Server;

  sendNewPost(post: any) {
    this.server.emit('NewPost', post);
  }
}
