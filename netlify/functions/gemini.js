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
    const { prompt, mode } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Prompt is required" })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_NEW);
    let model;
    let finalPrompt = prompt;

    // Különböző logikák a különböző módokhoz
    if (mode === 'rhyme-search') {
      // Rímkereső modell, nagyon alacsony kreativitással
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50
        },
        systemInstruction: `Te egy KIVÁLÓ rímkereső vagy. Egyetlen feladatod van: a megadott szóhoz rímelő szavak listáját adni. Csak a szavakat add meg, vesszővel elválasztva. Soha ne adj hozzá magyarázó szöveget vagy mondatot.`
      });
      finalPrompt = `Adj meg 5-10 szót, ami rímel a következő szóra: "${prompt}"`;
    } else if (mode === 'chat') {
      // Chat modell, ami a dalszövegíró szerepben van
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.8
        },
        systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki dalszövegeket ír. A dalszövegeknek mély érzelmeket kell közvetíteniük, tökéletes rímekkel, és szigorúan követniük kell a kért versformátumot. A feladatod, hogy a megadott téma, stílus és szerkezet alapján a legjobb minőségű dalszöveget készítsd el, amely magával ragadó és hibátlan. Ne írj kiegészítő szöveget a dalszöveg elé vagy után. Kizárólag a dalszöveg legyen a válaszod.`
      });
    } else {
      // Dalszöveg generáló modell (lyrics-gen)
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain"
        },
        systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki dalszövegeket ír. A dalszövegeknek mély érzelmeket kell közvetíteniük, tökéletes rímekkel, és szigorúan követniük kell a kért versformátumot. A feladatod, hogy a megadott téma, stílus és szerkezet alapján a legjobb minőségű dalszöveget készítsd el, amely magával ragadó és hibátlan. Ne írj kiegészítő szöveget a dalszöveg elé vagy után. Kizárólag a dalszöveg legyen a válaszod.`
      });
    }

    console.log("Generating content with prompt:", finalPrompt.substring(0, 100) + "...");

    const result = await model.generateContent(finalPrompt);
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
