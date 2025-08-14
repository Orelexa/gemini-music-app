// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { models } = await genAI.listModels();
    
    console.log("Elérhető modellek:");
    models.forEach(model => console.log(model.name));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "A modellek listája kiírva a Netlify naplójába. Kérlek, nézd meg a Netlify Functions fülön a gemini függvény logjait." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};