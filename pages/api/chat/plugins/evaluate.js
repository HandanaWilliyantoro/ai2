import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  AIPluginTool,
  RequestsGetTool,
  RequestsPostTool
} from "langchain/tools";

export default async function handler (req, res) {
    try {
        let {url} = req.query;

        const body = req.method == 'POST' ? req.body : undefined;
        const method = body?.method?.toUpperCase() ?? req.method;

        if (!url) {
            res.status(400).json({ error: 'There is no Target-Endpoint header in the request' });
            return;
        }

        const data = await fetch(url, {method, body})

        const response = await data.text();

        if(response){
            res.status(200).json({data: response, code: 200, text: 'evaluate plugin success'})
        } else {
            res.status(404).json({code: 404, text: 'failed to evaluate plugin action'})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
};