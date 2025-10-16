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
    const { prompt, mode, imageData } = JSON.parse(event.body);

    if (!prompt && mode !== 'image-gen') {
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
    if (mode === 'image-gen') {
      // Képgenerálás Gemini 2.5 Flash Image modellel
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-image"
      });
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Keressük meg a base64 képet a válaszban
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                  image: part.inlineData.data,
                  mimeType: part.inlineData.mimeType || 'image/jpeg'
                })
              };
            }
          }
        }
        
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Nem sikerült a képet generálni" })
        };
      } catch (imageError) {
        console.error("Image generation error:", imageError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: `Kép generálási hiba: ${imageError.message}` })
        };
      }
      
    } else if (mode === 'rhyme-search') {
      // Rímkereső modell, nagyon alacsony kreativitással
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50
        },
        systemInstruction: `Te egy KIVÁLÓ rímkereső vagy. Egyetlen feladatod van: a megadott szóhoz rímelő szavak listáját adni. Csak a szavakat add meg, vesszővel elválasztva. Soha ne adj hozzá magyarázó szöveget vagy mondatot.`
      });
      finalPrompt = `Adj meg 5-10 szót, ami rímel a következő szóra: "${prompt}"`;
    } else if (mode === 'music-style') {
      // Zenei stílus ajánlás
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        },
        systemInstruction: `Te egy ZENEI SZAKÉRTŐ vagy. A feladatod, hogy a dalszöveg alapján ajánlj zenei stílusokat, műfajokat, hangulatokat és tempót. Legyél konkrét és praktikus.`
      });
    } else if (mode === 'melody-ideas') {
      // Dallam ötletek
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 800
        },
        systemInstruction: `Te egy ZENESZERZŐ vagy. A feladatod, hogy dallam ötleteket adj a dalszöveghez: milyen legyen a dallam íve, ritmus, hangterjedelme, karaktere. Adj konkrét javaslatokat.`
      });
    } else if (mode === 'chord-progression') {
      // Akkord progresszió generálás
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600
        },
        systemInstruction: `Te egy HARMONIZÁLÓ SZAKÉRTŐ vagy. A feladatod, hogy akkord progressziókat ajánlj a dalszöveghez különböző hangnemekben. Adj meg konkrét akkord sorokat (pl. C - Am - F - G) és magyarázd el, miért illenek a dalhoz.`
      });
    } else if (mode === 'translate-english') {
      // Angol fordítás
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        },
        systemInstruction: `Te egy PROFI FORDÍTÓ vagy, aki dalszövegeket fordít magyarról angolra. A fordításnak meg kell őriznie a rímeket, a ritmust és az érzelmi töltetét. Ha kell, kreatívan alkalmazkodj, de maradj hű az eredeti jelentéshez és hangulathoz.`
      });
    } else if (mode === 'chat') {
      // Chat modell, ami a dalszövegíró szerepben van
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.8
        },
        systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki dalszövegeket ír. A dalszövegeknek mély érzelmeket kell közvetíteniük, tökéletes rímekkel, és szigorúan követniük kell a kért versformátumot. A feladatod, hogy a megadott téma, stílus és szerkezet alapján a legjobb minőségű dalszöveget készítsd el, amely magával ragadó és hibátlan. Ne írj kiegészítő szöveget a dalszöveg elé vagy után. Kizárólag a dalszöveg legyen a válaszod.`
      });
    } else {
      // Dalszöveg generáló modell (lyrics-gen)
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
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

    console.log("Generating content with mode:", mode);

    // Csak akkor generáljunk szöveges tartalmat, ha nem képgenerálás
    if (mode === 'image-gen') {
  // Képgenerálás Gemini 2.5 Flash Image modellel
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-image"
  });
  
  // Pontosított prompt felirat nélküli képhez 2:3 arányban
  const enhancedPrompt = `${prompt}. 
FONTOS: A képen NE legyen SEMMIFÉLE szöveg, felirat, betű vagy írás! 
Csak vizuális elemek legyenek: tárgyak, természet, hangszerek, jelenetek.
Fotorealisztikus stílus, művészi borítókép, 2:3 (portrait) formátum.`;
  
  try {
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    
    // Keressük meg a base64 képet a válaszban
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              image: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/jpeg'
            })
          };
        }
      }
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Nem sikerült a képet generálni" })
    };
  } catch (imageError) {
    console.error("Image generation error:", imageError);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Kép generálási hiba: ${imageError.message}` })
    };
  }
}

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