import dbConnect from "@/util/mongo";
import Webhook from "@/models/Webhook";

export default async function handler (req, res) {
    try {

        await dbConnect();
        
        const {name, creator, url, image, desc} = req.body;

        const newWebhook = new Webhook({
            name,
            creator,
            url,
            image,
            desc
        })
        await newWebhook.save();

        const webhook = await Webhook.findOne({name});

        if(plugin){
            res.status(200).json({text: 'Create webhook success', code: 200, data: webhook});
        } else {
            res.status(404).json({text: 'Failed to create new webhook', code: 404});
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}