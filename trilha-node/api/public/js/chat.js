let socket = null;
let socket_admin_id = null;
let emailUser = null;

document.getElementById('start_chat').addEventListener('click', (event) => {
  socket = io();
  const chat_help = document.getElementById('chat_help');
  chat_help.style.display = 'none';

  const chat_in_support = document.getElementById('chat_in_support');
  chat_in_support.style.display = 'block';

  emailUser = document.getElementById('email').value;
  const text = document.getElementById('txt_help').value;

  socket.on('connect', () => {
    socket.emit(
      'client_first_access',
      { email: emailUser, text },
      (call, err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(call);
        }
      }
    );
  });
  socket.on('client_list_all_messages', (messages) => {
    const template_client = document.getElementById('message-user-template')
      .innerHTML;
    const template_admin = document.getElementById('admin-template').innerHTML;

    messages.forEach((message) => {
      let rendered = '';
      if (message.admin_id === null) {
        rendered = Mustache.render(template_client, {
          message: message.text,
          emailUser,
        });
      } else {
        rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        });
      }
      document.getElementById('messages').innerHTML += rendered;
    });
  });

  socket.on('admin_send_to_client', (message) => {
    socket_admin_id = message.admin_id;
    const template_admin = document.getElementById('admin-template').innerHTML;
    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });
    document.getElementById('messages').innerHTML += rendered;
  });
});

document
  .getElementById('send_message_button')
  .addEventListener('click', (event) => {
    event.preventDefault();

    const textElement = document.getElementById('message_user');

    socket.emit('client_send_to_admin', {
      text: textElement.value,
      admin_id: socket_admin_id,
    });

    const template_client = document.getElementById('message-user-template')
      .innerHTML;

    const rendered = Mustache.render(template_client, {
      message: textElement.value,
      email: emailUser,
    });
    document.getElementById('messages').innerHTML += rendered;
    textElement.value = '';
  });
