const nanoid = require("nanoid-esm");
const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post("/analyze-website", async (req, res) => {
  try {
    const websiteUrl = req.body?.url;
    // console.log("req: ", req.body?.url);
    if (!websiteUrl) {
      return res.status(400).send({
        error: `Website URL is required: ${websiteUrl}, body: ${req.body}`,
      });
    }

    // Perform your website analysis logic here
    // Example: fetching website content, analyzing SEO aspects, etc.

    const prompts = [
      {
        role: "system",
        content:
          "Act as a helpful expert in Search Engine Optimization (SEO), web data analysis, and marketing professional.",
      },
      {
        role: "user",
        content: `Analyze the curated website content ${websiteUrl} for SEO optimization and marketing insights, and provide recommendations to improve the website's search engine rankings and user experience.`,
      },
      // {
      //   role: "assistant",
      //   content:
      //     "What are the current SEO practices implemented on the website?",
      // },
      // {
      //   role: "assistant",
      //   content: "How can the website improve its search engine rankings?",
      // },
      // {
      //   role: "assistant",
      //   content:
      //     "What are the potential keywords that the website should target based on it's content?",
      // },
      // {
      //   role: "assistant",
      //   content: "What are the recommended on-page optimization techniques?",
      // },
      // {
      //   role: "assistant",
      //   content:
      //     "How can the website improve its user experience and engagement?",
      // },
      // {
      //   role: "assistant",
      //   content:
      //     "What are the effective digital marketing strategies for the website?",
      // },
    ];
    // Then, use OpenAI to generate insights
    const response = await openai.chat.completions.create({
      messages: prompts,
      model:
        //"gpt-3.5-turbo-1106",
        // "gpt-4-32k",
        // "gpt-4-1106-preview",
        "gpt-4-vision-preview",
      max_tokens: 500,
      // response_format: { type: "json_object" }, //this doesn't seem to work, even tho the docs say it's required..
    });

    // const response = await openai.chat.completions.create.createCompletion({
    //   model: "gpt-4-vision-preview",
    //   prompt: `Analyze the website at ${websiteUrl} for SEO optimization and marketing insights:`,
    //   max_tokens: 500,
    // });

    // console.log("response log", response.choices);

    res.status(200).send(response.choices);
  } catch (error) {
    console.error("Error analyzing website:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Function to fetch website content
async function fetchWebsiteContent(websiteUrl) {
  try {
    const response = await axios.get(websiteUrl);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch website content");
  }
}

// Function to analyze SEO aspects
function analyzeSEO(content) {
  // Perform SEO analysis logic here
  // Example: analyze meta tags, headings, keywords, etc.
  // For now, let's just return a dummy SEO analysis result
  return `SEO analysis for content: ${content.substring(0, 100)}...`;
}

// Function to analyze content and provide keyword recommendations
function analyzeContent(content) {
  // Perform content analysis logic here
  // Example: analyze text for keyword density, readability, etc.
  // For now, let's just return a dummy keyword recommendation
  return `Keyword recommendations for content: ${content.substring(0, 100)}...`;
}

// Function to perform website analysis
async function performWebsiteAnalysis(websiteUrl) {
  try {
    // Fetch website content
    const content = await fetchWebsiteContent(websiteUrl);

    // Analyze SEO aspects
    const seoAnalysis = analyzeSEO(content);

    // Analyze content and provide keyword recommendations
    const keywordRecommendations = analyzeContent(content);

    // Return analysis results
    return {
      seoAnalysis,
      keywordRecommendations,
    };
  } catch (error) {
    throw new Error("Failed to perform website analysis");
  }
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
