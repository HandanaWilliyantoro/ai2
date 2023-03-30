import Replicate from 'replicate-js';

const replicate = new Replicate({token: process.env.REPLICATE_TOKEN});

export default async function handler (req, res){
    try {
        const {prompt} = req.body;
        const openJourneyModel = await replicate.models.get('prompthero/openjourney');
        const openJourneyPrediction = await openJourneyModel.predict({ 
            prompt: `mdjrny-v4 style portrait of ${prompt}, 8k`,
            width: 512,
            height: 512,
            steps: 30, 
            intermediate_outputs: true, 
            batch_size: 2,
            num_outputs: 1
        });
        res.status(200).json({code: 200, text: "Create AI Art Successful", data: openJourneyPrediction[0]})
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Something went wrong', code: 500})
    }
}