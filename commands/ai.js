const { Configuration, OpenAIApi } = require("openai");

const InitiateOpenAI = (key) => {
    // const configuration = new Configuration({
    //         apiKey: key,
    //         basePath: "https://api.pawan.krd/v1",
        
    // });

    // // Return new instance of OpenAI api
    // return new OpenAIApi(configuration);
}

// const InitiateChatGPT = async (email, password, browserpath) => {
//     // const { ChatGPTAPI, getOpenAIAuth } = require('chatgpt');
//     // WORKING CODE BUT HEADFUL 
//     // const { ChatGPTAPI, getOpenAIAuth } = await import('chatgpt')
//     // const openAIAuth = await getOpenAIAuth({
//     //     email: email,
//     //     password: password,
//     //     executablePath: browserpath,
//     //     isGoogleLogin: true, 
//     // })
//     // const api = new ChatGPTAPI({ ...openAIAuth })
//     // await api.ensureAuth()
//     // return api;

//     // DOES NOT WORK!??!?!?
//     const { ChatGPTAPIBrowser } = await import('chatgpt');

//     const api = new ChatGPTAPIBrowser({
//         email: email,
//         password: password,
//         executablePath: browserpath,
//         // isGoogleLogin: true
//     })
//     await api.init()
//     console.log("Successfully authenticated to ChatGPT....")
//     return api;
// }

const GenerateChatGPTtext = async(ai, prompt) => {
    const response = await ai.sendMessage(prompt)
    // response is a markdown-formatted string
    console.log(response)
    return response;
}

const GenerateOpenAiImage = async (ai, description) => {
    let resp = await ai.createImage({
        prompt: description,
        n: 2,
        size: "256x256",
    })
    return [resp.data.data[0].url, resp.data.data[1].url];
}

const GenerateOpenAiImageCommand = {
    name: 'generate-image',
    description: 'Generate an image from OpenAI',
    options: [{
        name: 'prompt',
        description: 'Can be anything',
        type: 3,
        required: true
    }]
} 

const GenerateChatGPTtextCommand = {
    name: 'chatgpt',
    description: 'Ask anything from ChatGPT',
    options: [{
        name: 'prompt',
        description: 'Can be anything',
        type: 3,
        required: true
    }]
} 

// module.exports = { InitiateAI, GenerateImage, GenerateImageCommand, GenerateGPTchat, InitiateGPTchat };
module.exports = { InitiateOpenAI, InitiateChatGPT, GenerateOpenAiImage, GenerateChatGPTtextCommand, GenerateOpenAiImageCommand, GenerateChatGPTtext };
