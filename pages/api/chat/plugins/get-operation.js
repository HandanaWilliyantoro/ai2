export default async function handler(req, res) {
    try {
        const {query} = req.body;

        const data = await fetch(`https://chatgpt-ai-chat-bot.p.rapidapi.com/ask`, {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'chatgpt-ai-chat-bot.p.rapidapi.com',
                'content-type': 'application/json',
            },
            body: JSON.stringify({query, wordLimit: 4096})
        })
        const completion = await data.json();

        if(completion && completion.response){
            res.status(200).json({text: 'fetch plugin operation success', code: 200, data: completion.response})
        } else {
            res.status(404).json({text: 'failed to fetch plugin operation', code: 404})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500})
    }
}