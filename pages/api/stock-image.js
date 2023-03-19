export default async function handler (req, res){
    try {
        const {q} = req.body;
        
        const options = {
            method: 'GET',
            headers: {
                'Authorization': process.env.PEXELS_API_KEY,
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
            }
        };
        
        let response = await fetch(`https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${q}`, options)

        response = await response.json()

        const photos = await response.photos.map(a => ({
            source_url: a?.src?.landscape ?? a.src.original,
            thumbnail_url: a.src.original,
            title: a.alt,
            id: a.id,
            source: a.photographer
        }))

        if(photos && photos.length > 0){
            res.status(200).json({text: 'Fetch image search successfull', code: 200, data: photos})
        } else {
            res.status(401).json({text: 'Fetch image search failed', code: 401})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e, code: 500})
    }
}