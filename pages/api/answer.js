function promptGenerator (payload) {
    switch(payload.slug){
        case 'custom-generator':
            return `I want you to act as a custom writing generator and help me produce high-quality content on a variety of topics. The generator should be user-friendly, produce quality output quickly, and be cost-effective to maintain. Additionally, the generator should incorporate unique features to help set it apart from other writing tools. My first request is ${payload.keywords}`
        case 'grammar-corrector':
            return `You are a grammar corrector feature in a writing tool. A user has written the following sentence: "${payload.keywords}" Correct the grammar of the sentence and provide the corrected version, without explaining the correction.`
        case 'content-rewriter':
            return `You are a paraphraser feature in a writing tool. A user has written the following sentence: "${payload.keywords}" Paraphrase the sentence and provide the new version, without explaining the paraphrase.`
        case 'blog-generator':
            return `I want you to act as a blog generator. Generate a blog post about ${payload.keywords}, including examples of how it can impact ${payload.extra1}.`
        case 'paragraph-writer':
            return `You are a paragraph writer feature in a writing tool. Write a paragraph about ${payload.keywords}. The paragraph should be concise, informative, and well-structured.`
        case 'sentence-expander':
            return `You are a sentence expander feature in a writing tool. Expand the following sentence to include more details and make it more descriptive: "${payload.keywords}" The new version of the sentence should be grammatically correct and well-written, with at least two additional details included.`
        case 'content-summarizer':
            return `You are a content summarizer feature in a news app. Summarize the following news article into a single sentence that captures the main idea: "${payload.keywords}" The summary should be clear, concise, and accurately reflect the main point of the article.`
        case 'reply-to-message':
            return `Act as a chatbot that can have conversations on a variety of topics. Your responses should be informal and conversational. Let's start with the first message:  "${payload.keywords}" ${payload.extra1 ? `. and please include these words "${payload.extra1}" in the response message` : ''}`
        case 'reply-to-email':
            return `Act as a reply to email feature. You are a smart email assistant designed to reply to messages on behalf of a busy professional. Compose an email response to the following emails: "${payload.keywords}" ${payload.extra1 ? `and please include these following word inside the email body: "${payload.extra1}"` : ''}`
        case 'press-release-generator':
            return `Act as a press release generator. You are a PR software designed to generate press releases for a company. Write a press release about ${payload.extra1}. Include the following information: Name of The Product: ${payload.keywords}, Keywords: ${payload.extra2}`
        case 'catchy-tagline':
            return `Act as a catchy tagline generator feature. You are a marketing tool designed to come up with catchy taglines for a new product. Generate a tagline based on this given information:  ${payload.keywords}`
        case 'headline-generator':
            return `Act as a headline generator feature. You are a tool designed to generate attention-grabbing headlines for a news article. Create a headline for an article about ${payload.keywords}`
        case 'job-summary':
            return `Your task is to generate a list of key features that should be included in a job summary to make it effective and compelling for potential job seekers. The features should be relevant for a ${payload.keywords} role. Some points to consider might include: ${payload.extra1}`
        case 'job-description':
            return `Act as a job description generator feature. You are a tool designed to generate job descriptions for various positions. Write a job description for a ${payload.keywords} role with key skills as following: ${payload.extra1}`
        case 'job-qualification':
            return `Your task is to generate a list of key qualifications that are commonly required for job postings across a variety of industries and roles. These qualifications should be relevant to ${payload.keywords} role and may include both technical and soft skills. Some points to consider might include: ${payload.extra1}`
        case 'job-responsibilities':
            return `Your task is to generate a list of key responsibilities that are commonly required for job postings across a variety of industries and roles. These responsibilities should be relevant to ${payload.keywords} role and may include both technical and soft skills. Some points to consider might include: ${payload.extra1}`
        case 'interview-questions':
            return `Your task is to generate a list of potential interview questions that employers may ask during job interviews across a variety of industries and roles. These questions should be relevant to ${payload.keywords} role and may include both technical and behavioral`
        case 'interview-feedbacks':
            return `Your task is to generate an interview feedback report for ${payload.keywords} role that includes both a summary of the candidate's performance during the interview and specific notes on areas for improvement. The report should be clear, concise, and informative, and should include suggestions for how the candidate can improve their skills or performance in the future. Some points to consider might include: ${payload.extra1}`
        default:
            return payload.keywords
    }
}

export default async function handler (req, res) {
    try {
        const prompt = await promptGenerator(req.body)

        const payload = {
            model: "gpt-3.5-turbo",
            messages: [
              {role: "system", content: `You are a helpful assistant named Handana AI that accurately answers the user's queries based on the given SOURCE.`},
              {role: "user", content: prompt}
            ],
            temperature: 0.9,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 500,
        };

        const completion = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = await completion.json();

        if(data && data.choices.length > 0 && data.choices[0].message.content){
            res.status(200).json({text: 'Fetch successfull', code: 200, data: data.choices[0].message.content})
        } else {
            res.status(404).json({text: 'Failed to fetch response', code: 404})
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500})
    }
}