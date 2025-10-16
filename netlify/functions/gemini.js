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
      
    } else if (mode === 'rhyme-search') {
      // Rímkereső modell
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
      // Akkord progresszió
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600
        },
        systemInstruction: `Te egy HARMONIZÁLÓ SZAKÉRTŐ vagy. A feladatod, hogy akkord progressziókat ajánlj a dalszöveghez különböző hangnemekben. Adj meg konkrét akkord sorokat (pl. C - Am - F - G) és magyarázd el, miért illenek a dalhoz.`
      });
      
    } else if (mode === 'translate-english') {
      // Angol fordítás - SUNO formátummal
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        },
        systemInstruction: `Te egy PROFI FORDÍTÓ vagy, aki dalszövegeket fordít magyarról angolra SUNO AI formátumban.

KRITIKUS SZABÁLYOK:
1. Őrizd meg a [Verse], [Chorus], [Bridge] struktúrát!
2. Őrizd meg az érzelmeket () zárójelben!
3. A fordításnak meg kell őriznie a rímeket, ritmust és érzelmi töltetét
4. Kreatívan alkalmazkodj, de maradj hű az eredeti jelentéshez
5. CSAK a lefordított dalszöveget add vissza, semmi mást!`
      });
      
    } else if (mode === 'suno-prompt') {
      // Suno STYLE prompt generálás (csak stílus, NEM dalszöveg!)
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        },
        systemInstruction: `Te egy SUNO AI STYLE PROMPT SZAKÉRTŐ vagy. A feladatod, hogy CSAK a zenei stílus, hangulat, hangszerelés leírását add meg ANGOL NYELVEN.

KRITIKUS SZABÁLYOK:
1. NE írj dalszöveget!
2. NE használj [Verse], [Chorus], [Bridge] jelöléseket!
3. NE használj () zárójeleket érzelmekhez!
4. CSAK egyszerű, folyamatos leírás
5. ANGOL nyelvű legyen
6. Maximum 1000 karakter
7. Konkrét zenei jellemzők: műfaj, hangszerek, tempó, hangulat, produkció
8. HA NINCS DALSZÖVEG (instrumentális zene), ELSŐ SORBAN írd: "No Vocals - Instrumental"

PÉLDA JÓ FORMÁTUM (énekes):
Melancholic indie folk with acoustic guitar fingerpicking
Soft male vocals with intimate, vulnerable delivery
Slow tempo around 70 BPM
Layered harmonies building in chorus sections
Minimal piano and subtle strings in bridge
Warm, organic production with natural reverb
Reflective and bittersweet mood with hopeful undertones
Light percussion with brushes on snare

Alternative folk-rock elements
Instruments: acoustic guitar, piano, strings, light drums
Overall mood: introspective, emotional, uplifting

PÉLDA INSTRUMENTÁLIS FORMÁTUM (nincs dalszöveg):
No Vocals - Instrumental
Melancholic acoustic guitar fingerpicking
Slow tempo around 70 BPM
Minimal piano and subtle strings
Warm, organic production with natural reverb
Reflective and bittersweet mood
Light percussion with brushes

FONTOS: 
- Ha VAN dalszöveg → normál leírás énekkel
- Ha NINCS dalszöveg → kezdd "No Vocals - Instrumental"-lal
- Egyszerű leírás, nincs struktúra jelölés, nincs zárójel!`
      });
      
    } else if (mode === 'chat') {
      // Chat modell - SUNO formátummal
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.8
        },
        systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki Suno AI-hoz készít dalszövegeket.

KRITIKUS SZABÁLYOK:
1. A dalszövegnek SUNO FORMÁTUMBAN kell lennie!
2. Használd ezeket a jelöléseket:
   - [Verse 1], [Verse 2], stb. a versszakok elején
   - [Chorus] a refrén elején
   - [Bridge] ha van átvezetés
   - [Outro] ha van befejező rész
3. Minden szakasz ELŐTT adj meg érzelmeket () zárójelben
4. Tökéletes rímek és ritmus
5. Mély érzelmek
6. NE írj semmi extra szöveget
7. CSAK a dalszöveg legyen a válaszban a jelölésekkel!`
      });
      
    } else {
      // Dalszöveg generáló modell (lyrics-gen) - SUNO formátummal
      model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain"
        },
        systemInstruction: `Te egy PROFI MAGYAR KÖLTŐ vagy, aki Suno AI-hoz készít dalszövegeket.

KRITIKUS SZABÁLYOK:
1. A dalszövegnek SUNO FORMÁTUMBAN kell lennie!
2. Használd ezeket a jelöléseket:
   - [Verse 1], [Verse 2], stb. a versszakok elején
   - [Chorus] a refrén elején
   - [Bridge] ha van átvezetés
   - [Outro] ha van befejező rész
3. Minden szakasz ELŐTT adj meg érzelmeket () zárójelben, pl:
   (melancholic, soft) vagy (uplifting, powerful)
4. Tökéletes rímek és ritmus
5. Mély érzelmek
6. Szigorúan kövesd a kért versformátumot
7. NE írj semmi extra szöveget a dalszöveg elé vagy után
8. CSAK a dalszöveg legyen a válaszban a jelölésekkel!

PÉLDA FORMÁTUM:
[Verse 1]
(melancholic, introspective)
Az éjszaka csendben hull
Csillagok fénye rám talál
Szívemben a fájdalom ül
De tudom, holnap új nap vár

[Chorus]
(uplifting, powerful)
Repülök a felhők felett
Szabad vagyok végre, érzem
A szél visz engem tovább
És semmi sem állít meg

Így kell kinéznie MINDEN dalszövegnek!`
      });
    }

    console.log("Generating content with mode:", mode);

    // Csak akkor generáljunk szöveges tartalmat, ha nem képgenerálás
    if (mode !== 'image-gen') {
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