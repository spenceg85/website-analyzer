import express from 'express';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/analyze-website', async (req, res) => {
    try {
        const { websiteUrl } = req.body;
        if (!websiteUrl) {
            return res.status(400).send({ error: 'Website URL is required' });
        }

        // Perform your website analysis logic here
        // Example: fetching website content, analyzing SEO aspects, etc.

        // Then, use OpenAI to generate insights
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Analyze the website at ${websiteUrl} for SEO and marketing insights:`,
            max_tokens: 500
        });

        res.status(200).send({ insights: response.data.choices[0].text });
    } catch (error) {
        console.error('Error analyzing website:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
