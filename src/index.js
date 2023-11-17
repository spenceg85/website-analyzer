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
        error: `Website URL is required, you entered: ${websiteUrl}, body: ${res.body}`,
      });
    }

    // Perform your website analysis logic here
    // Example: fetching website content, analyzing SEO aspects, etc.
    const analysis = await performWebsiteAnalysis(websiteUrl).then(
      (analyzedRes) => {
        console.log("analysis: ", analyzedRes);
        return analyzedRes;
      }
    );

    const prompts = [
      {
        role: "system",
        content:
          "Act as a helpful expert in Search Engine Optimization (SEO), web data analysis, and marketing professional.",
      },
      {
        role: "user",
        content: `Analyze the curated website content: "${analysis}" for SEO optimization and marketing insights, and provide recommendations to improve the website's search engine rankings and user experience.`,
      },
      {
        role: "assistant",
        content: `What are the current SEO practices implemented on this website? Website's curated content: "${analysis}`,
      },
      {
        role: "assistant",
        content: `How can this website improve its search engine rankings? Curated website content: "${analysis}"`,
      },
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
    return response.data; // Axios automatically handles the response stream
  } catch (error) {
    // Axios wraps the native Node.js error, so we access it via `error.response`
    throw new Error(
      `Error fetching content from ${websiteUrl}: ${error.message}`
    );
  }
}

// Function to analyze SEO aspects
function analyzeSEO(content) {
  // Perform SEO analysis logic here
  // Example: analyze meta tags, headings, keywords, etc.
  // Basic logic to analyze meta tags, headings, keywords, etc.
  // This should be expanded based on specific SEO analysis requirements
  const metaTagMatch = content.match(/<meta.*?>/g) || [];
  const headingsMatch = content.match(/<h[1-6].*?>.*?<\/h[1-6]>/g) || [];
  // ... additional analysis logic

  // For now, let's just return a dummy SEO analysis result
  // return `SEO analysis for content: ${content.substring(0, 100)}...`;
  return {
    metaTags: metaTagMatch.length,
    headings: headingsMatch.length,
    // ... additional analysis results
  };
}

// Function to analyze content and provide keyword recommendations
function analyzeContent(content) {
  // Perform content analysis logic here
  // Example: analyze text for keyword density, readability, etc.
  // This should be expanded based on specific content analysis requirements
  const wordCount = content.split(/\s+/).length;
  // ... additional analysis logic

  return {
    wordCount,
    // ... additional analysis results
  };
}

// Function to perform website analysis
async function performWebsiteAnalysis(websiteUrl) {
  try {
    const content = await fetchWebsiteContent(websiteUrl);
    const seoAnalysis = analyzeSEO(content);
    const wordcount = analyzeContent(content);

    const finalResponse = {
      content,
      url: websiteUrl,
      seoAnalysis,
      wordcount,
    };
    return JSON.stringify(finalResponse);
  } catch (error) {
    throw new Error(`Failed to perform website analysis: ${error.message}`);
  }
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
