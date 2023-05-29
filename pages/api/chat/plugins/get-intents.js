export default async function handler (req, res) {
    try {
        const {query} = req.body

        const payload = {
            model: "gpt-3.5-turbo",
            messages: [
            {role: "system", content: `You are an assistant bot named Handana AI, you are designed to extract and generate suitable actions based on the given text. Treat the provided objective as your goal and adhere to the instructions. To assist you in connecting to the internet, we have included excerpts from the web, which you can utilize to respond to user inquiries.`},
            {role: 'user', content: query}
            ],
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 1000,
            n: 1,
        };

        const data = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        const completion = await data.json();

        const response = [];
        const lines = completion.choices[0].message.content.split(/\n+/);
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
            res.status(200).json({text: 'fetch plugins intents success', code: 200, data: {result: response}})
        } else {
            res.status(404).json({text: 'fetch plugins failed', code: 404})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
}