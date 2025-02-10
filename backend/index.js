require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const genAI = new GoogleGenerativeAI("AIzaSyBjJdfMq3MiHWFfB1xi1DPUQT-F0VXFH24");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// API Route for OpenAI
app.post("/api/process", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const result = await model.generateContent(prompt);
        res.status(200).json({
            "success": true,
            "Message": result.response.text()
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing request" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
