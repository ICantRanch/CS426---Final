import express from 'express';
import logger from 'morgan';

const port = 5005
const app = express();

app.use(logger('dev'));
app.use(express.json());

//const servicePorts = [5000, 5001, 5002, 5004];
const servicePorts = [
  { name: 'cards', port: 5000 },
  { name: 'scores', port: 5004 },
  { name: 'query', port: 5002 },
  { name: 'translator', port: 5001 },
];

app.post('/events', async (req, res) => {
  const event = req.body;

  console.log(`(${process.pid}) Event Bus (Received Event) ${event.type}`);

  for (const { name, port } of servicePorts) {
    try {
      console.log(
        `(${process.pid}) Event Bus (Sending Event to ${port}) ${event.type}`
      );

      await fetch(`http://${name}:${port}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.log(err);
    }
  }

  res.send({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`(${process.pid}) Event Bus Listening on ${port}`);
});
