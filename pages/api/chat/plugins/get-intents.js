export default async function handler (req, res) {
    try {
        const {query, conversationId} = req.body

        const data = await fetch(`https://chatgpt-ai-chat-bot.p.rapidapi.com/ask`, {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'chatgpt-ai-chat-bot.p.rapidapi.com',
                'content-type': 'application/json',
            },
            body: JSON.stringify({query, wordLimit: 4096, conversationId})
        })

        const completion = await data.json();

        const response = [];
        const lines = completion.response.split(/\n+/);
        await lines.map(line => {
            const parts = line.split(/^(.*?):\s*(.*)$/);
            const action = parts[1];
            const thought = parts[2];
            if (action == null || thought == null) return;
            response.push({
                action,
                thought
            });
        })

        if(res){
            res.status(200).json({text: 'fetch plugins intents success', code: 200, data: {result: response, conversationId}})
        } else {
            res.status(404).json({text: 'fetch plugins failed', code: 404})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
}