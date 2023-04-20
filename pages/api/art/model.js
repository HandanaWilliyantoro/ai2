export default async function handler (req, res) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'dezgo.p.rapidapi.com'
            }
        };

        const data = await fetch('https://dezgo.p.rapidapi.com/info', options);

        const response = await data.json();

        if(response && response.models){
            res.status(200).json({text: 'Fetch models success', code: 200, data: response.models})
        } else {
            res.status(401).json({text: 'Failed to fetch models', code: 401})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500})
    }
}