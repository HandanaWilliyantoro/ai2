export default async function handler (req, res) {
    try {
        let {query, language} = req.body;

        const prompt = `I want you to act as a ${language} code generator that answers with proper indentation and spacing. Generate a code snippet that ${query}.`;

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '4eb68c2ad1msh2c6664f78ca391ep11b4bajsnfb0317b70d3f',
                'X-RapidAPI-Host': 'chatgpt-ai-chat-bot.p.rapidapi.com'
            },
            body: JSON.stringify({query: prompt, wordLimit: 4096})
        };

        let data = await fetch('https://chatgpt-ai-chat-bot.p.rapidapi.com/ask', options)

        data = await data.json();

        if(data && data.response){
            res.status(200).json({text: 'Fetch code successfull', code: 200, data: data.response})
        } else {
            res.status(404).json({text: "Failed to fetch code", code: 404})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({
            text: 'Internal server error',
            code: 500
        })
    }
}