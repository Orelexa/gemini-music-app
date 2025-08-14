// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { models } = await genAI.listModels();
    const modelNames = models.map(model => model.name).join('\n');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Elérhető modellek:\n${modelNames}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};