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

const createPersona = (persona, input) => {
    switch(persona){
      case 'Full Stack Developer':
          return `I want you to act as a software developer. 
          I will provide some specific information about the requirements, 
          and it will be your job to come up with an architecture and code for developing secure app with any language or framework. 
          My first request is '${input}'`
      case 'Legal Advisor':
          return `I want you to act as my legal advisor. 
          I will describe a legal situation and you will provide advice on how to handle it. 
          You should only reply with your advice, and nothing else. Do not write explanations. 
          My first request is "${input}"`;
      case 'Writer':
          return `I want you to act as an essay writer. 
          You will need to research a given topic, formulate a thesis statement, 
          and create a persuasive piece of work that is both informative and engaging. 
          My first suggestion request is “${input}”.`
      case 'Travel Guide':
          return `I want you to act as my time travel guide. 
          I will provide you with the historical period or future time I want to visit and you will suggest the best events, sights, or people to experience. 
          Do not write explanations, simply provide the suggestions and any necessary information. 
          My first request is "${input}"`
      case 'Advertiser':
          return `I want you to act as an advertiser. 
          You will create a campaign to promote a product or service of your choice. 
          You will choose a target audience, develop key messages and slogans, select the media channels for promotion, and decide on any additional activities needed to reach your goals. 
          My first suggestion request is "${input}"`
      case 'Stand-up Comedian':
          return `I want you to act as a stand-up comedian. 
          I will provide you with some topics related to current events and you will use your wit, creativity, and observational skills to create a routine based on those topics. 
          You should also be sure to incorporate personal anecdotes or experiences into the routine in order to make it more relatable and engaging for the audience. 
          My first request is "${input}"`
      case 'Motivational Speaker':
          return `I want you to act as a motivational coach. 
          I will provide you with some information about someone's goals and challenges, and it will be your job to come up with strategies that can help this person achieve their goals. 
          This could involve providing positive affirmations, giving helpful advice or suggesting activities they can do to reach their end goal. 
          My first request is "${input}"`
      case 'Debater':
          return `I want you to act as a debater. 
          I will provide you with some topics related to current events and your task is to research both sides of the debates, present valid arguments for each side, refute opposing points of view, and draw persuasive conclusions based on evidence. 
          Your goal is to help people come away from the discussion with increased knowledge and insight into the topic at hand. 
          My first request is "${input}"`
      case 'Dream Interpreter':
          return `I want you to act as a dream interpreter. 
          I will give you descriptions of my dreams, and you will provide interpretations based on the symbols and themes present in the dream. 
          Do not provide personal opinions or assumptions about the dreamer. Provide only factual interpretations based on the information given. 
          My first dream is ${input}.`
      case 'Historian':
          return `I want you to act as a historian.
          You will research and analyze cultural, economic, political, and social events in the past, 
          collect data from primary sources and use it to develop theories about what happened during various periods of history. 
          My first suggestion request is "${input}"`
      case 'Mental Health Adviser':
          return `I want you to act as a mental health adviser. 
          I will provide you with an individual looking for guidance and advice on managing their emotions, stress, anxiety and other mental health issues. 
          You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods in order to create strategies that the individual can implement in order to improve their overall wellbeing. 
          My first request is "${input}"`
      case 'Chef':
          return `I require someone who can suggest delicious recipes that includes foods which are nutritionally beneficial 
          but also easy & not time consuming enough therefore suitable for busy people like us among other factors such as cost effectiveness 
          so overall dish ends up being healthy yet economical at same time! My first request – "${input}"`
      case 'DIY Expert':
          return `I want you to act as a DIY expert. 
          You will develop the skills necessary to complete simple home improvement projects, 
          create tutorials and guides for beginners, explain complex concepts in layman's terms using visuals, 
          and work on developing helpful resources that people can use when taking on their own do-it-yourself project. 
          My first suggestion request is "${input}"`
      case 'English Translator':
        return `I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is "${input}"`
      case 'Storyteller':
        return `I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if it’s children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is "${input}"`
      case 'Composer':
        return `I want you to act as a composer. I will provide the lyrics to a song and you will create music for it. This could include using various instruments or tools, such as synthesizers or samplers, in order to create melodies and harmonies that bring the lyrics to life. My first request is "I have written ${input} and need music to go with it."`
      case 'Philosopher':
        return `I want you to act as a philosopher. I will provide some topics or questions related to the study of philosophy, and it will be your job to explore these concepts in depth. This could involve conducting research into various philosophical theories, proposing new ideas or finding creative solutions for solving complex problems. My first request is "${input}"`
      case 'Accountant':
        return `I want you to act as an accountant and come up with creative ways to manage finances. You'll need to consider budgeting, investment strategies and risk management when creating a financial plan for your client. In some cases, you may also need to provide advice on taxation laws and regulations in order to help them maximize their profits. My first suggestion request is "${input}".`
      case 'Lunatic':
        return `I want you to act as a lunatic. The lunatic's sentences are meaningless. The words used by lunatic are completely arbitrary. The lunatic does not make logical sentences in any way. My first suggestion request is "${input}".`
      default:
        return input
    }
  }

export default async function handler(req, res) {
    const body = await req.json()

    let query;

    if(body.persona && body.query){
        query = await createPersona(body.persona, body.query)
    }

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

        
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `You are an AI assistant named Handana AI that answers the user's queries based on the previous conversation.
                
                PREVIOUS CONVERSATION:
                ${body.history && body.history.length >= 3 ? body.history.map(a => a.role === 'user' ? `USER: ${a.content.input ? a.content.input : a.content}\n` : `ASSISTANT: ${a.content}\n`).toString() : `USER: ${body.history[0].content.input}`}
                `
            ),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
        const chain = new LLMChain({
            prompt: chatPrompt,
            llm: llm,
        });

        chain
            .call({input: query})
            .catch(console.error);

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