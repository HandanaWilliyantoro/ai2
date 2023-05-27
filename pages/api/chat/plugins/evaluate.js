async function removeQueryString(url) {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
  
    for (const [key, value] of params.entries()) {
      if (value.startsWith("<")) {
        params.delete(key);
      }
    }
  
    urlObj.search = params.toString();
    return urlObj.toString();
}

export default async function handler (req, res) {
    try {
        let url = await removeQueryString(req.url.split('url=')[1])

        const body = req.method == 'POST' ? req.body : undefined;
        const method = body?.method?.toUpperCase() ?? req.method;

        if (!url) {
            res.status(400).json({ error: 'There is no Target-Endpoint header in the request' });
            return;
        }

        const data = await fetch(url, {method, body})

        const response = await data.text();

        if(response){
            res.status(200).json({data: response, code: 200, text: 'evaluate plugin success'})
        } else {
            res.status(404).json({code: 404, text: 'failed to evaluate plugin action'})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e})
    }
};