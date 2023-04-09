export default async function handler (req, res) {
    try {

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'internal server error', code: 500, error: e.message})
    }
}