import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import logger from './modules/logger.js'
import { randomBytes } from 'crypto';
import Store from './store.js'

const port = 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


app.get('/cards', async (req, res) => {
    const cards = Store.read()
    res.send(cards)
})

app.post('/cards', async (req, res) => {
    const {sentence} = req.body
    console.log(sentence)
    //Check for duplicate
    const cards = await Store.read()
    console.log(cards)
    if(cards.some((card) => card.sentence === sentence)){
        logger.warn('Error: Duplicate sentence')
        res.status(500).send({
            status: 'ERROR',
            message: 'Duplicate sentence',
          });
        return
    }

    //Fetch translation
    let translationRes = await fetch('http://translator:5001/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({sentence}),
        });
    let translationData = await translationRes.json()
    console.log(translationData)
    let translation = translationData.translation
    console.log(translation)




    const id = randomBytes(4).toString('hex');
    const card = {id, sentence, translation}
    await Store.push(card)

    try {
        await fetch('http://event-bus:5005/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CardCreated',
            data: {
              id,
              sentence,
              translation
            },
          }),
        });
        logger.info(`Card Created: Sentence: ${sentence}`)
      } catch (err) {
        console.log(`(${process.pid}) Cards Service: ${err}`);
        logger.error(err)
        res.status(500).send({
          status: 'ERROR',
          message: err,
        });
        return
      }

      res.send(card)

})

app.post('/events', async (req, res) => {
  const event = req.body;
  const type = event.type;
  console.log(`(${process.pid}) Posts Service Received Event: ${type}`);

  if (type === 'DropStorage') {
    await Store.drop();
  }

  res.send({});
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})