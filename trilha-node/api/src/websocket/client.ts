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

  const usersService = new UsersService();
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  socket.on('client_first_access', async ({ email, text }: MessageParams) => {
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

    const allMessages = await messagesService.showByUser(user.id);

    socket.emit('client_list_all_messages', allMessages);

    const allConnections = await connectionsService.findAllWithoutAdmin();

    io.emit('admin_list_all_users', allConnections);
  });

  socket.on('client_send_to_admin', async (params) => {
    const { text, admin_id } = params;

    const { user_id } = await connectionsService.findBySocketID(socket.id);
    const { email } = await usersService.findById(user_id);

    const message = await messagesService.create({ user_id, text, admin_id });

    io.to(admin_id).emit('admin_receive_message', { message, email });
  });
});
