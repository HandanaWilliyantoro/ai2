import { NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import {AIPluginTool, RequestsGetTool, RequestsPostTool} from 'langchain/tools'
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const config = {
    api: {
      bodyParser: false,
    },
    runtime: "edge",
};

export default async function handler(req, res) {
    const body = await req.json()

    try {
        if (!OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not defined.");
        }

        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        const llm = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
            temperature: 0.9,
            streaming: true,
            modelName: "gpt-3.5-turbo",
            temperature: 0.7,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            maxTokens: 500,
            streaming: true,
            callbackManager: CallbackManager.fromHandlers({
                handleLLMNewToken: async (token) => {
                    await writer.ready;
                    await writer.write(encoder.encode(`${token}`));
                },
                handleLLMEnd: async () => {
                    await writer.ready;
                    await writer.close();
                },
                handleLLMError: async (e) => {
                    await writer.ready;
                    await writer.abort(e);
                },
            }),
        });

        if(body.pluginUrl){
          const tools = [
            new RequestsGetTool(),
            new RequestsPostTool(),
            await AIPluginTool.fromPluginUrl(
              body.pluginUrl
            ),
          ];
          const agent = await initializeAgentExecutorWithOptions(
            tools,
            new ChatOpenAI({ temperature: 0 }),
            { agentType: "chat-conversational-react-description", verbose: true }
          );
        
          const result = await agent.call({
            input: `${body.history && body.history.length >= 3 ? `${body.history[body.history.length - 2].content}, QUESTION: ${body.query}` : undefined}`,
          });

          const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
              `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the previous answer. translate the answer to indonesia language.
              ${body.history && body.history.length >= 3 ? `${body.history[body.history.length - 2].content}, ANSWER: ${result.output}` : undefined}
              `
            ),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        const chain = new LLMChain({
            prompt: chatPrompt,
            llm: llm,
        });

        chain.call({input: body.query}).catch(console.error)
        } else {
          const chatPrompt = ChatPromptTemplate.fromPromptMessages([
              SystemMessagePromptTemplate.fromTemplate(
                  `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the previous answer. translate the answer to indonesia language.
                  ${body.history && body.history.length >= 3 ? body.history[body.history.length - 2].content : undefined}
                  `
              ),
              HumanMessagePromptTemplate.fromTemplate("{input}"),
          ]);
          const chain = new LLMChain({
              prompt: chatPrompt,
              llm: llm,
          });

          chain
              .call({input: body.query})
              .catch(console.error);
        }

        return new NextResponse(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify(
                { error: error.message },
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            )
        );
    }
}