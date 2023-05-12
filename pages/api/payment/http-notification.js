export async function handler (req, res) {
    try {
        console.log(req.body, req.headers);
        res.status(200).json({data: req.body, headers: req.headers, text: 'http notification'})
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}