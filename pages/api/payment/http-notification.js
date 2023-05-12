export default async function handler (req, res) {
    try {

        const body = req.body
        const headers = req.headers

        res.status(200).json({body, headers, text: 'http notification'})
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}