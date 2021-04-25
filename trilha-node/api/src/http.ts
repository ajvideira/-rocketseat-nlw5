import express, { response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

import './database';
import routes from './routes';

const app = express();
const http = createServer(app);
const io = new Server(http);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(routes);
app.get('/pages/client', (req, res) => {
  return res.render('html/client.html');
});

export { http, io };