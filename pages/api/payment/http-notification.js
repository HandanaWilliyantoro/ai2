export async function handler (req, res) {
    try {
        console.log(req.body, req.headers);
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}