import { OpenAIStream } from "../../../util/stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  const { title, highlight } = (await req.json())

  if (!title) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given text. answer based on given query language`},
      {role: "user", content: `Act as a blog generator and write a blog post on the topic "${title}". The post should be at least 500 words long and should include a catchy title and subheadings. ${highlight ? `Make sure to highlight ${highlight}.` : ''}`}
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  console.log(payload, 'ini payloadnya ya')

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;