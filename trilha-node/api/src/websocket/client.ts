import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';
import { UsersService } from '../services/UsersService';

type MessageParams = {
  email: string;
  text: string;
};

io.on('connect', async (socket) => {
  console.log('conectou-se: ', socket.id);

  socket.on('client_first_access', async ({ email, text }: MessageParams) => {
    const usersService = new UsersService();
    const connectionsService = new ConnectionsService();
    const messagesService = new MessagesService();

    const user = await usersService.create(email);

    let connection = await connectionsService.finByUser(user.id);
    if (!connection) {
      connection = await connectionsService.save({
        user_id: user.id,
        socket_id: socket.id,
      });
    } else {
      connection.socket_id = socket.id;
      await connectionsService.save(connection);
    }

    await messagesService.create({ user_id: user.id, text });
  });
});
