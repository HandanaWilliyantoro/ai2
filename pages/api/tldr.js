import { Configuration, OpenAIApi } from "openai-edge"


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler (req) {
  try {
    const { searchParams } = new URL(req.url)

    let q = searchParams.get('q')
    let sources = searchParams.get('summaryContent')

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given text. answer based on given query language`},
            {role: "user", content: `Provide a 5-10 sentence rephrased answer to the query based on the sources..\n###\nSOURCES\n\n${sources.toString()}\n###\nQUERY\n${q}\n###\nANSWER`}
        ],
        max_tokens: 500,
        temperature: 0.2,
        stream: true,
    }, { responseType: 'stream' })

    return new Response(completion.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}