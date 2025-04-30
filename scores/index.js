import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import logger from './modules/logger.js'
import Store from './store.js'

const port = 5004
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

function roundToTwo(num) {
  return Number(num.toFixed(2))
}


app.get('/scores', (req, res) => {
    const scores = Store.read()
    res.send(scores)
})

app.post('/scores', async (req, res) => {
    const {id, score, multiplier, scoreType} = req.body
    let newScore = score
    let newMult = multiplier

    switch(scoreType){
        case 3:
            //If score is 1, add one
            newScore = newScore == 1 ? 2 : newScore
            newMult += 0.1
            newScore *= newMult
            newMult = roundToTwo(newMult)
            newScore = roundToTwo(newScore)
            break
        case 2:
            newScore = Math.max(newScore/2, 1)
            newMult = 1.1
            break
        case 1:
            newScore = 1
            newMult = 1.1
            break
        default:
            logger.error('Error: Undefined score type')
            res.status(500).send({
                status: 'ERROR',
                message: 'Undefined score type',
            });
            return
    }
    await Store.update(id, {id, newScore, newMult})

    try {
        await fetch('http://event-bus:5005/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CardScoreUpdated',
            data: {
              id,
              score: newScore,
              multiplier: newMult
            },
          }),
        });
      } catch (err) {
        console.log(`(${process.pid}) Scores Service: ${err}`);
        logger.error(err)
        res.status(500).send({
          status: 'ERROR',
          message: err,
        });
      }


    res.send({newScore})
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