import { OpenAIStream } from "../../util/stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const handler = async (req, res) => {
  const { q, summaryContent } = req.body

  if (!q) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const query = `Provide a 5-10 sentence rephrased answer to the query based on the sources without citing the sources. \n###\nSOURCES\n\n${summaryContent.toString()}\n###\nQUERY\n${q}\n###\nANSWER`

  try {
    const data = await fetch(`https://chatgpt-ai-chat-bot.p.rapidapi.com/ask`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'chatgpt-ai-chat-bot.p.rapidapi.com',
        'content-type': 'application/json',
      },
      body: JSON.stringify({query, wordLimit: 4096})
    })

    const response = await data.json()

    const encodedParams = new URLSearchParams();
    
    encodedParams.append("source_language", "en");
    encodedParams.append("target_language", "id");
    encodedParams.append("text", response.response.replace(/\n/g,'\n\n'));

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '4eb68c2ad1msh2c6664f78ca391ep11b4bajsnfb0317b70d3f',
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
      },
      body: encodedParams
    };  

    const responseData = await fetch('https://text-translator2.p.rapidapi.com/translate', options)

    const resJson = await responseData.json()

    if(resJson.data.translatedText){
      res.status(200).json({ code: 200, text: 'fetch summary successful', data:  resJson.data.translatedText})
    } else {
      res.status(404).json({text: 'failed to fetch summary', code: 404})
    }
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'internal server error', code: 500, error: e})
  }
};

export default handler;