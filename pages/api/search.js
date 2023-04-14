import Ads from "./ads.json"

export default async function handler(req, res) {
  try {
    let {q} = req.body;
    q = await q.toString().replaceAll(',', ' AND ')

    const data = await fetch(`https://real-time-web-search.p.rapidapi.com/search?q=${q}&limit=20`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'real-time-web-search.p.rapidapi.com',
      },
    })

    const engine = await data.json()

    const sources = await engine.data.slice(0, 5)

    const parsedSources = await sources.map((a, i) => `Sources [${i+1}]: ${a.snippet}`)

    let relatedAds;

    const ads = await Ads.filter(a => a.type === 'search')

    for(let i = 0 ; i < ads.length ; i++){
      const words = ads[i].keywords;
      for(let j = 0 ; j < words.length ; j++){
        if (q.includes(words[j])) {
          relatedAds = ads[i]
          break
        }
      }
    }

    relatedAds && engine.data.pop()
    relatedAds && engine.data.unshift(relatedAds)

    res.status(200).json({ question: q, response: engine, summaryContent: parsedSources })
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'internal server error', code: 500, error: e})
  }
}
