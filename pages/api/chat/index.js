import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler (req, res) {

  try {
    const { query, history, pluginUrl } = req.body
  
    if(pluginUrl){
  
    } else {
      const chat = new ChatOpenAI({ 
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
      })
    
      const data = await chat.call([
          new SystemChatMessage(`You are a helpful assistant named Handana AI that accurately answers the user's queries based on the previous answer. translate the answer to indonesia language.
            ${history && history.length >= 3 ? history[history.length - 2].content : undefined}
          `),
          new HumanChatMessage(query)
      ]);
    
      res.status(200).json({data: data.text, code: 200, text: "Fetch chat success"})

    }
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'Internal server error', code: 500, error: e})
  }
};