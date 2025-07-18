const mongoose = require('mongoose');
const Delivery = require('../models/Delivery');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { PineconeClient } = require('pinecone-client');

async function ingestDeliveries() {
  await mongoose.connect(process.env.MONGO_URI);
  const deliveries = await Delivery.find({});
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const pinecone = new PineconeClient();
  await pinecone.init({ apiKey: process.env.PINECONE_API_KEY, environment: process.env.PINECONE_ENV });
  const index = pinecone.Index('deliveries');

  for (const d of deliveries) {
    const text = `Delivery to ${d.address} at ${d.time}. Tip: $${d.tip}.`;
    const [vector] = await embeddings.embedQuery(text);
    await index.upsert([{ id: d._id.toString(), values: vector, metadata: { text } }]);
  }
  mongoose.disconnect();
}
if (require.main === module) ingestDeliveries();
module.exports = ingestDeliveries;