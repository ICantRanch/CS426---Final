import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@atlas-db:27017';
const client = new MongoClient(url);
const dbName = 'Atlas';

let cards;
const getCardCollection = async () => {
  if (!cards) {
    await client.connect();
    cards = client.db(dbName).collection('scores');
  }
  return cards;
};

const read = async () => {
  try {
    const collection = await getCardCollection();
    const docs = await collection.find({}).toArray();
    return docs || [];
  } catch (err) {
    console.log(err);
  }
};

const push = async (card) => {
  try {
    const collection = await getCardCollection();
    await collection.insertOne(card)
  } catch (err) {
    console.log(err);
  }
};

const update = async (id, newValues) => {
  try {
    const collection = await getCardCollection();
    //What if collection is empty: upsert:true
    await collection.updateOne({id: id}, {$set: newValues}, {upsert: true})
  } catch (err) {
    console.log(err);
  }
}

const drop = async () => {
  try {
    const collection = await getCardCollection();
    await collection.deleteMany({});
  } catch (err) {
    console.log(err);
  }
};

export default {
  read,
  push,
  update,
  drop,
};
