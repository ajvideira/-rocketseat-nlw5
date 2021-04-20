import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello Get!' });
});

app.post('/', (req, res) => {
  res.json({ message: 'Hello Post!' });
});

app.listen(3333, () => {
  console.log('Server has been started.');
});
