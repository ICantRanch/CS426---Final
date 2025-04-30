import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import logger from './modules/logger.js'
import translate from '@iamtraction/google-translate'

const port = 5001
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

export async function getTranslation(sentence){
    console.log("To translate: " + sentence)
    let sentenceTranslation
    await translate(sentence, {to: 'en'}).then(res => {
        sentenceTranslation = res.text
        return 
    }).catch(err => {
        console.error("Error in translating")
        console.error(err);
        logger.error(err)
        return
    });
    return sentenceTranslation
}

app.post('/translate', async (req,res) => {
    const { sentence } = req.body
    const translation = await getTranslation(sentence)
        
        //Check sentence is a alphanumeric string
    console.log(translation)
    res.send({translation})
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})