import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export default async function handler (req, res) {
    try {
        const model = new ChatOpenAI({ temperature: 0 });
        const embeddings = new OpenAIEmbeddings();
      
        const browser = new WebBrowser({ model, embeddings });
      
        const result = await browser.call(
          `"https://www.themarginalian.org/2015/04/09/find-your-bliss-joseph-campbell-power-of-myth","who is joseph campbell"`
        );

        res.status(200).json({text: 'Fetch tldr success', code: 200, data: result})
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
}