// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body);

  // GEMINI FLASH MODEL - SOKKAL NAGYOBB INGYENES KVÓTA
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_NEW);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
