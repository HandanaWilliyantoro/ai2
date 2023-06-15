import dbConnect from "@/util/mongo";
import Plugin from "@/models/Plugin";
import App from "@/models/App";
import Webhook from "@/models/Webhook";
import UserApp from "@/models/UserApp";

const findApp = async (type, id) => {
    switch(type){
        case 'My Apps':
            return UserApp.findById(id);
        case 'Plugin':
            return Plugin.findById(id);
        case 'Application':
            return App.findById(id);
        case 'Webhook':
            return Webhook.findById(id);
    }
}

export default async function handler (req, res) {
    try {
        await dbConnect();
        
        const {type, id} = req.body;

        const selectedApp = await findApp(type, id);

        if(selectedApp){
            res.status(200).json({text: 'Fetch app success', code: 200, data: selectedApp})
        } else {
            res.status(404).json({text: 'Fetch selected app failed', code: 404})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500});
    }
}