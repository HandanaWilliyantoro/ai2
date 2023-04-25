import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler (req, res) {

  const { history } = req.body

  const chat = new ChatOpenAI({ 
    modelName: "gpt-3.5-turbo",
    temperature: 0.8,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    maxTokens: 500,
  })

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given text. translate every answer to indonesia language."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
  });

  const result = await chain.call({
    input: q,
  });

  res.status(200).json(result)
};