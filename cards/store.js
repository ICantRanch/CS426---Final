import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@atlas-db:27017';
const client = new MongoClient(url);
const dbName = 'Atlas';

let cards;
const getCardCollection = async () => {
  if (!cards) {
    await client.connect();
    cards = client.db(dbName).collection('cards');
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
  drop,
};
