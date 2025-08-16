// netlify/functions/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  // CORS headers minden válaszhoz
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Prompt is required" })
      };
    }

    // GEMINI FLASH MODEL - NAGYOBB INGYENES KVÓTA
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_NEW);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain"
      },
      // Egyszerűsített systemInstruction a hatékonyabb rímelés érdekében
      systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki dalszövegeket ír. A dalszövegeknek mély érzelmeket kell közvetíteniük, tökéletes rímekkel, és szigorúan követniük kell a kért versformátumot. A feladatod, hogy a megadott téma, stílus és szerkezet alapján a legjobb minőségű dalszöveget készítsd el, amely magával ragadó és hibátlan. Ne írj kiegészítő szöveget a dalszöveg elé vagy után. Kizárólag a dalszöveg legyen a válaszod.`
    });

    console.log("Generating content with prompt:", prompt.substring(0, 100) + "...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Empty response from AI model" })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: text.trim() })
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "Ismeretlen hiba történt";
    
    if (error.message.includes("API_KEY")) {
      errorMessage = "API kulcs hiba - ellenőrizd a környezeti változókat";
    } else if (error.message.includes("quota")) {
      errorMessage = "API kvóta elfogyott - próbáld később";
    } else if (error.message.includes("safety")) {
      errorMessage = "A tartalom biztonsági okokból nem generálható";
    } else if (error.message.includes("rate")) {
      errorMessage = "Túl sok kérés - várj egy kicsit";
    } else {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
