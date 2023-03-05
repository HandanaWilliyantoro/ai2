import jsdom from 'jsdom'
import { Readability } from "@mozilla/readability";

const cleanSourceText = (text) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

const filterText = (text) => {
  return text
  .filter(a => a !== null ? a : undefined)
  .filter(a => a.text !== 'Something went wrong, but don’t fret — let’s give it another shot.')
}

export default async function handler(req, res) {
  try {
    const {q} = req.body;
    const {JSDOM} = jsdom;
    const virtualConsole = new jsdom.VirtualConsole();

    const data = await fetch(`https://real-time-web-search.p.rapidapi.com/search?q=${q}&limit=20`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '4eb68c2ad1msh2c6664f78ca391ep11b4bajsnfb0317b70d3f',
        'X-RapidAPI-Host': 'real-time-web-search.p.rapidapi.com',
      },
    })

    const engine = await data.json()

    const search_result = engine.data

    let sources = (await Promise.all(
        search_result.map(async (a) => {
            try {
                const response = await fetch(a.url);
                const html = await response.text();
                const dom = new JSDOM(html, {virtualConsole});
                const doc = dom.window.document;
                const parsed = new Readability(doc).parse();

                if (parsed) {
                    let sourceText = await cleanSourceText(parsed.textContent);
                    return { ...a, text: sourceText };
                } else {
                    return
                }
            } catch(e) {
                return
            }
        })
    ))

    let filteredSources = await filterText(sources)

    const parsedSources = await filteredSources.map((a, i) => `Sources [${i+1}]: ${a.text.slice(0, 1500)}`).slice(0, 3)

    res.status(200).json({ question: q, response: engine, summaryContent: parsedSources })
  } catch(e) {
    console.log(e)
    res.status(500).json({text: 'internal server error', code: 500, error: e})
  }
}
