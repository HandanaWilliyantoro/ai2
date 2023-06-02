import { OpenAIStream } from "@/util/stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  const { q, summaryContent } = (await req.json())

  if (!q) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given SOURCE.`},
      {role: "user", content: `Provide a long summary based on the given sources if the source is relevant to the asked question and do not cite the sources. \nSOURCES:\n${summaryContent.toString()} \n\n QUESTION: ${q}`}
    ],
    temperature: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;