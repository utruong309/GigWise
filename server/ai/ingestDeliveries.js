import Delivery from '../models/Delivery.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function getDeliveryDocuments(userId) {
  const deliveries = await Delivery.find({ userId });

  const rawText = deliveries
    .map((d) =>
      `Delivery to ${d.address} at ${d.time} on ${d.date}. Tip: $${d.tip}, Total: $${d.total}, Platform: ${d.platform}`
    )
    .join('\n');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  return splitter.createDocuments([rawText]);
}