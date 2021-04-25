import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';

io.on('connect', async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const connections = await connectionsService.findAllWithoutAdmin();

  io.emit('admin_list_all_users', connections);

  socket.on('admin_list_messages_by_user', async (params, callback) => {
    const { user_id } = params;

    const messages = await messagesService.showByUser(user_id);
    callback(messages);
  });

  socket.on('admin_send_message', async (params) => {
    const { user_id, text } = params;

    const message = await messagesService.create({
      user_id,
      text,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionsService.finByUser(user_id);

    io.to(socket_id).emit('admin_send_to_client', message);
  });

  socket.on('admin_user_in_support', async (params) => {
    const { user_id } = params;

    await connectionsService.updateAdminID(user_id, socket.id);

    const connections = await connectionsService.findAllWithoutAdmin();

    io.emit('admin_list_all_users', connections);
  });
});
