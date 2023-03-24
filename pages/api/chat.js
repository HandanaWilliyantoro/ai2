import { OpenAIStream } from "../../util/stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const createPersona = (persona, input) => {
  switch(persona){
    case 'Full Stack Developer':
        return {role: 'user', content: `I want you to act as a software developer. 
        I will provide some specific information about the requirements, 
        and it will be your job to come up with an architecture and code for developing secure app with any language or framework. 
        My first request is '${input}'`}
    case 'Legal Advisor':
        return {role: 'user', content: `I want you to act as my legal advisor. 
        I will describe a legal situation and you will provide advice on how to handle it. 
        You should only reply with your advice, and nothing else. Do not write explanations. 
        My first request is "${input}"`};
    case 'Writer':
        return {role: 'user', content: `I want you to act as an essay writer. 
        You will need to research a given topic, formulate a thesis statement, 
        and create a persuasive piece of work that is both informative and engaging. 
        My first suggestion request is “${input}”.`}
    case 'Travel Guide':
        return {role: 'user', content: `I want you to act as my time travel guide. 
        I will provide you with the historical period or future time I want to visit and you will suggest the best events, sights, or people to experience. 
        Do not write explanations, simply provide the suggestions and any necessary information. 
        My first request is "${input}"`}
    case 'Advertiser':
        return {role: 'user', content: `I want you to act as an advertiser. 
        You will create a campaign to promote a product or service of your choice. 
        You will choose a target audience, develop key messages and slogans, select the media channels for promotion, and decide on any additional activities needed to reach your goals. 
        My first suggestion request is "${input}"`}
    case 'Stand-up Comedian':
        return {role: 'user', content: `I want you to act as a stand-up comedian. 
        I will provide you with some topics related to current events and you will use your wit, creativity, and observational skills to create a routine based on those topics. 
        You should also be sure to incorporate personal anecdotes or experiences into the routine in order to make it more relatable and engaging for the audience. 
        My first request is "${input}"`}
    case 'Motivational Speaker':
        return {role: 'user', content: `I want you to act as a motivational coach. 
        I will provide you with some information about someone's goals and challenges, and it will be your job to come up with strategies that can help this person achieve their goals. 
        This could involve providing positive affirmations, giving helpful advice or suggesting activities they can do to reach their end goal. 
        My first request is "${input}"`}
    case 'Debater':
        return {role: 'user', content: `I want you to act as a debater. 
        I will provide you with some topics related to current events and your task is to research both sides of the debates, present valid arguments for each side, refute opposing points of view, and draw persuasive conclusions based on evidence. 
        Your goal is to help people come away from the discussion with increased knowledge and insight into the topic at hand. 
        My first request is "${input}"`}
    case 'Dream Interpreter':
        return {role: 'user', content: `I want you to act as a dream interpreter. 
        I will give you descriptions of my dreams, and you will provide interpretations based on the symbols and themes present in the dream. 
        Do not provide personal opinions or assumptions about the dreamer. Provide only factual interpretations based on the information given. 
        My first dream is ${input}.`}
    case 'Historian':
        return {role: 'user', content: `I want you to act as a historian.
        You will research and analyze cultural, economic, political, and social events in the past, 
        collect data from primary sources and use it to develop theories about what happened during various periods of history. 
        My first suggestion request is "${input}"`}
    case 'Mental Health Adviser':
        return {role: 'user', content: `I want you to act as a mental health adviser. 
        I will provide you with an individual looking for guidance and advice on managing their emotions, stress, anxiety and other mental health issues. 
        You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods in order to create strategies that the individual can implement in order to improve their overall wellbeing. 
        My first request is "${input}"`}
    case 'Chef':
        return {role: 'user', content: `I require someone who can suggest delicious recipes that includes foods which are nutritionally beneficial 
        but also easy & not time consuming enough therefore suitable for busy people like us among other factors such as cost effectiveness 
        so overall dish ends up being healthy yet economical at same time! My first request – "${input}"`}
    case 'DIY Expert':
        return {role: 'user', content: `I want you to act as a DIY expert. 
        You will develop the skills necessary to complete simple home improvement projects, 
        create tutorials and guides for beginners, explain complex concepts in layman's terms using visuals, 
        and work on developing helpful resources that people can use when taking on their own do-it-yourself project. 
        My first suggestion request is "${input}"`}
    default:
        return {role: 'user', content: input}
  }
}

const handler = async (req) => {
  const { history } = (await req.json())

  const messages = history.map(a => {
    if(a.content.input) {
        const contentIncludePersona = createPersona(a.content.persona, a.content.input)
        return contentIncludePersona
    } else {
        return {role: a.role, content: a.content}
    }
})

  if (!history) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given text. answer based on given query language`},
      ...messages
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;