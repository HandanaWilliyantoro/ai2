async function encodeBufferAsBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default async function handler (req, res) {
    try {
        const {prompt, model} = req.body

        const encodedParams = new URLSearchParams();
        encodedParams.append("prompt", prompt);
        encodedParams.append("guidance", "7");
        encodedParams.append("steps", "30");
        encodedParams.append("sampler", "euler_a");
        encodedParams.append("upscale", "1");
        encodedParams.append("negative_prompt", "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft");
        encodedParams.append("model", model || "epic_diffusion_1_1");
        
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'dezgo.p.rapidapi.com'
            },
            body: encodedParams
        };
        
        const data = await fetch('https://dezgo.p.rapidapi.com/text2image', options)
    
        const buffer = await data.arrayBuffer();
        const base64Image = await encodeBufferAsBase64(buffer);

        if(base64Image){
            res.status(200).json({code: 200, text: 'create art success', data: `data:image/png;base64, ${base64Image}`});
        } else {
            res.status(401).json({text: 'image not found', code: 401})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({
            text: 'internal server error',
            code: 500,
            data: e.message
        })
    }
}