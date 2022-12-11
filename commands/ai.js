const { Configuration, OpenAIApi } = require("openai");

const InitiateAI = (key) => {
    let configuration = new Configuration({
        apiKey: key,
    });
    // Return new instance of OpenAI api
    return new OpenAIApi(configuration);
}

const GenerateImage = async (ai, description) => {
    let resp = await ai.createImage({
        prompt: description,
        n: 2,
        size: "256x256",
    })
    return [resp.data.data[0].url, resp.data.data[1].url];
}

const GenerateImageCommand = {
    name: 'generate-image',
    description: 'Generate an image from OpenAI',
    options: [{
        name: 'prompt',
        description: 'Can be anything',
        type: 3,
        required: true
    }]
} 

module.exports = { InitiateAI, GenerateImage, GenerateImageCommand };
