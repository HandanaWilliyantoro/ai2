import dbConnect from "@/util/mongo";
import Plugin from "@/models/Plugin";

export default async function handler (req, res) {
    try {

        await dbConnect();
        
        const {name, creator, url, image, desc} = req.body;

        const newPlugin = new Plugin({
            name,
            creator,
            url,
            image,
            desc
        })
        await newPlugin.save();

        const plugin = await Plugin.findOne({name});

        if(plugin){
            res.status(200).json({text: 'Create plugin success', code: 200, data: plugin});
        } else {
            res.status(404).json({text: 'Failed to create new plugin', code: 404});
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}