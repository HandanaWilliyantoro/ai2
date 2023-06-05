import dbConnect from "@/util/mongo";
import App from "@/models/App";

export default async function handler (req, res) {
    try {

        await dbConnect();
        
        const {name, creator, url, image, desc} = req.body;

        const newApp = new App({
            name,
            creator,
            url,
            image,
            desc
        })
        await newApp.save();

        const app = await App.findOne({name});

        if(app){
            res.status(200).json({text: 'Create app success', code: 200, data: app});
        } else {
            res.status(404).json({text: 'Failed to create new plugin', code: 404});
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}