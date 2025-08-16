// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body);

  // A legújabb és legmegbízhatóbb modell - MOST AZ ÚJ API KULCCSAL
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_NEW);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

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
