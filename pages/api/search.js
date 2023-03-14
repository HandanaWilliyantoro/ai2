export default async function handler(req, res) {
  try {
    let {q} = req.body;
    q = await q.toString().replaceAll(',', ' AND ')

    const data = await fetch(`https://real-time-web-search.p.rapidapi.com/search?q=${q}&limit=20`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '4eb68c2ad1msh2c6664f78ca391ep11b4bajsnfb0317b70d3f',
        'X-RapidAPI-Host': 'real-time-web-search.p.rapidapi.com',
      },
    })

    const engine = await data.json()

    const search_result = engine.data

    const parsedSources = await search_result.map((a, i) => `Sources [${i+1}]: ${a.snippet}`)

    res.status(200).json({ question: q, response: engine, summaryContent: parsedSources })
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'internal server error', code: 500, error: e})
  }
}
