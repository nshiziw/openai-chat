const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBjJdfMq3MiHWFfB1xi1DPUQT-F0VXFH24");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "In short words, how many countries are in Africa";

async function generateAIContent() {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

generateAIContent();
