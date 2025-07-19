import { Router } from 'express';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Delivery from '../models/Delivery.js';

const router = Router();

router.post('/ask-ai', async (req, res) => {
  try {
    const { question, userId } = req.body;
    const deliveries = await Delivery.find({ userId });
    const docs = deliveries.map(d => ({
      pageContent: `Delivery to ${d.address} at ${d.time}. Tip: $${d.tip}.`,
      metadata: { id: d._id.toString() }
    }));

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-pro-latest",
    });

    //use a chat prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful delivery assistant. Use the provided delivery history to answer the user's question."],
      ["human", "{question}\n\nDelivery history:\n{context}"]
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const response = await combineDocsChain.invoke({
      question,
      context: docs,
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error('AI endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;