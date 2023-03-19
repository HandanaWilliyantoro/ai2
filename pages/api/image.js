export default async function handler (req, res){
    try {
        const {q} = req.body;
        
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'real-time-image-search.p.rapidapi.com'
            }
        };
        
        let response = await fetch(`https://real-time-image-search.p.rapidapi.com/search?query=${q}`, options)

        response = await response.json()

        if(response.data && response.data.length > 0){
            res.status(200).json({text: 'Fetch image search successfull', code: 200, data: response.data})
        } else {
            res.status(401).json({text: 'Fetch image search failed', code: 401})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e, code: 500})
    }
}