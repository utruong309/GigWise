import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { getDeliveryDocuments } from "./ingestDeliveries.js";

export async function askGemini(userId, question) {

  const docs = await getDeliveryDocuments(userId);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorstore.asRetriever();

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro-latest",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a helpful delivery assistant. Use the following delivery history to answer the question.\n\n{context}\n\nQuestion: {input}`
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
    outputParser: new StringOutputParser(),
  });

  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  const result = await chain.invoke({ input: question });
  return result.answer || "Sorry, I couldn't find an answer.";
}