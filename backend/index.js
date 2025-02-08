require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");


const app = express();
const port = process.env.PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// API Route for OpenAI
app.post("/api/process", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 400,
        });

        res.json({ response: response.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing request" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
