import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  RequestsGetTool,
  RequestsPostTool,
  AIPluginTool,
} from "langchain/tools";

export default async function handler (req, res) {

  const {q, pluginUrl} = req.body;

  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await AIPluginTool.fromPluginUrl(
      pluginUrl
    )];
    const agent = await initializeAgentExecutorWithOptions(
      tools,
      new ChatOpenAI({ temperature: config.temperature ?? 0, openAIApiKey: openaiApiKey, modelName: config.model, frequencyPenalty: config.presence_penalty, maxTokens: config.max_tokens, presencePenalty: config.presence_penalty }),
      'chat-zero-shot-react-description',
      true,
    );

    const result = await agent.call({
      input: q,
    });

    res.status(200).json(result)
};