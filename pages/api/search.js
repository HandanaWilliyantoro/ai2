import ads from "./assets/ads.json"

export default async function handler(req, res) {
  try {
    let {q} = req.body;
    q = await q.toString().replaceAll(',', ' AND ')

    const data = await fetch(`https://real-time-web-search.p.rapidapi.com/search?q=${q}&limit=35`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'real-time-web-search.p.rapidapi.com',
      },
    })

    const engine = await data.json()

    const sources = await engine.data.slice(0, 10)

    const parsedSources = await sources.map((a, i) => `Sources [${i+1}]: ${a.snippet}`)

    const searchAds = ads.filter(ad => {
      if(ad && ad.keywords && ad.keywords.some(keyword => q.includes(keyword))){
        delete ad.ads
        return ad
      }
    });

    if(searchAds && searchAds.length > 0){
      await engine.data.unshift(searchAds[0])
    }

    res.status(200).json({ question: q, response: engine, summaryContent: parsedSources })
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'internal server error', code: 500, error: e})
  }
}
