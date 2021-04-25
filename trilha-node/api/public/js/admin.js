const socket = io();
let connectionsUsers = [];

socket.on('admin_list_all_users', (connections) => {
  connectionsUsers = connections;
  document.getElementById('list_users').innerHTML = '';

  let template = document.getElementById('template').innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
      user_id: connection.user_id,
    });

    document.getElementById('list_users').innerHTML += rendered;
  });
});

function call(user_id, email) {
  const adminTemplate = document.getElementById('admin_template').innerHTML;
  const rendered = Mustache.render(adminTemplate, {
    email: email,
    id: user_id,
  });
  document.getElementById('supports').innerHTML += rendered;

  socket.emit('admin_user_in_support', { user_id });

  socket.emit('admin_list_messages_by_user', { user_id }, (messages) => {
    const divAllMessages = document.getElementById(`allMessages${user_id}`);
    messages.forEach((message) => {
      const divMessage = document.createElement('div');

      if (message.admin_id === null) {
        divMessage.className = 'admin_message_client';
        divMessage.innerHTML += `<span>${email}</span>`;
        divMessage.innerHTML += `<span>${message.text}</span>`;
        divMessage.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format('DD/MM/YYYY HH:mm:ss')}</span>`;
      } else {
        divMessage.className = 'admin_message_admin';
        divMessage.innerHTML += `<span>Atendente</span>`;
        divMessage.innerHTML += `<span>${message.text}</span>`;
        divMessage.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format('DD/MM/YYYY HH:mm:ss')}</span>`;
      }
      divAllMessages.appendChild(divMessage);
    });
  });
}

function sendMessage(id) {
  const textElement = document.getElementById(`send_message_${id}`);

  socket.emit('admin_send_message', { user_id: id, text: textElement.value });

  const divAllMessages = document.getElementById(`allMessages${id}`);

  const divMessage = document.createElement('div');
  divMessage.className = 'admin_message_admin';
  divMessage.innerHTML += `<span>Atendente</span>`;
  divMessage.innerHTML += `<span>${textElement.value}</span>`;
  divMessage.innerHTML += `<span class="admin_date">${dayjs().format(
    'DD/MM/YYYY HH:mm:ss'
  )}</span>`;
  divAllMessages.appendChild(divMessage);

  textElement.value = '';
}

socket.on('admin_receive_message', (data) => {
  const { message, email } = data;

  const divAllMessages = document.getElementById(
    `allMessages${message.user_id}`
  );
  const divMessage = document.createElement('div');
  divMessage.className = 'admin_message_client';
  divMessage.innerHTML += `<span>${email}</span>`;
  divMessage.innerHTML += `<span>${message.text}</span>`;
  divMessage.innerHTML += `<span class="admin_date">${dayjs(
    message.created_at
  ).format('DD/MM/YYYY HH:mm:ss')}</span>`;
  divAllMessages.appendChild(divMessage);
});
