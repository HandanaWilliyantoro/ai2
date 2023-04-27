import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage, AIChatMessage } from "langchain/schema";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  RequestsGetTool,
  RequestsPostTool,
  AIPluginTool,
} from "langchain/tools";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export default async function handler (req, res) {
  try {
    const { query, history, pluginUrl } = req.body;
    
    const chat = new ChatOpenAI({ 
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      maxTokens: 500,
    })

    if(pluginUrl){
      const tools = [
        await AIPluginTool.fromPluginUrl(
          pluginUrl
        ),
      ];
      const agent = await initializeAgentExecutorWithOptions(
        tools,
        chat,
        { agentType: "chat-conversational-react-description", verbose: true }
      );
    
      const result = await agent.call({
        input: query,
      });

      const data = await chat.call([
        new SystemChatMessage(`You are a helpful assistant named Handana AI that accurately answers the user's queries based on the previous answer..
          ${history && history.length >= 3 ? `${history[history.length - 2].content}, ANSWER: ${result.output}` : undefined}
        `),
        new AIChatMessage(result.output)
      ]);

      if(data && data.text){
        res.status(200).json({text: 'Fetch answer success', code: 200, data: data.text})
      } else {
        res.status(404).json({text: 'Failed to fetch answer', code: 404})
      }
    } else {
      const data = await chat.call([
          new SystemChatMessage(`You are a helpful assistant named Handana AI that accurately answers the user's queries based on the previous answer..
            ${history && history.length >= 3 ? history[history.length - 2].content : undefined}
          `),
          new HumanChatMessage(query)
      ]);
    
      if(data.text){
        res.status(200).json({data: data.text, code: 200, text: "Fetch chat success"})
      } else {
        res.status(404).json({text: 'Failed to fetch answer', code: 401})
      }
    }
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'Internal server error', code: 500, error: e})
  }
};