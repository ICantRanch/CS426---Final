import express from 'express';
import cors from 'cors';
import Store from './store.js';
import morgan from 'morgan'

const port = 5002
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.get('/cards', async (req, res) => {
  const cards = await Store.read();
  res.send(cards);
});

app.delete('/dropstore', async (req, res) => {
  Store.drop();
  await emitDropEvent();
  res.send({ status: 'OK' });
});

app.post('/events', async  (req, res) => {
  const { type, data } = req.body;

  console.log(data)

  console.log("EVENT TYPE: " + type)

  const cards = await Store.read();
  if (type === 'CardCreated') {
    const { id, sentence, translation } = data;
    cards.push({ id, sentence, translation, score: 1, multiplier: 1.1 })
  }

  if (type === 'CardScoreUpdated') {
    const { id, score, multiplier } = data;
    console.log(data)
    const card = cards.find((card) => card.id == id);
    card.score = score
    card.multiplier = multiplier
    console.log(card)
  }


  //sort cards
  cards.sort((a,b) => a.score - b.score)

  Store.write(cards);

  console.log(cards);

  res.send({ status: 'OK' });
});

const emitDropEvent = async () => {
  try {
    await fetch('http://event-bus:5005/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'DropStorage',
      }),
    });
  } catch (err) {
    console.log(`(${process.pid}) Query Delete Service: ${err}`);
  }
};


app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
