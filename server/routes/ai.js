import { Router } from 'express';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeClient } from 'pinecone-client';
import { RunnableSequence } from 'langchain/schema/runnable';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

const router = Router();

router.post('/ask-ai', async (req, res) => {
  try {
    const { question } = req.body;

    // 1. Set up LLM and retriever
    const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    const pinecone = new PineconeClient();
    await pinecone.init({ apiKey: process.env.PINECONE_API_KEY, environment: process.env.PINECONE_ENV });
    const index = pinecone.Index('deliveries');
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex: index }
    );
    const retriever = vectorStore.asRetriever();

    // 2. Create a chain that stuffs retrieved docs into the LLM prompt
    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt: undefined, // Use default prompt, or customize if you want
    });

    // 3. Compose the retrieval and QA steps
    const chain = RunnableSequence.from([
      async (input) => ({
        question: input.question,
        context: await retriever.getRelevantDocuments(input.question),
      }),
      async ({ question, context }) => {
        // context is an array of documents; combineDocsChain expects { question, context }
        return combineDocsChain.invoke({ question, context });
      },
    ]);

    // 4. Run the chain
    const response = await chain.invoke({ question });
    res.json({ answer: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;