<?php
/**
 * Gemini API Backend
 * Helyettesíti a Netlify Functions funkciót
 *
 * Használat: POST kérés a következő paraméterekkel:
 * - prompt: string (kötelező)
 * - mode: string (lyrics-gen, image-gen, music-style, stb.)
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Csak POST metódust fogadunk
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// API kulcs beállítása
// FONTOS: Cseréld le a saját Gemini API kulcsodra!
$GEMINI_API_KEY = getenv('GEMINI_API_KEY_NEW') ?: 'REMOVED_API_KEY';

// Input adatok olvasása
$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['prompt'] ?? '';
$mode = $input['mode'] ?? 'lyrics-gen';

// Validáció
if (empty($prompt) && $mode !== 'image-gen') {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt is required']);
    exit;
}

// Gemini modell kiválasztása mode alapján
$modelMap = [
    'image-gen' => 'gemini-2.5-flash-image',
    'rhyme-search' => 'gemini-2.0-flash-exp',
    'music-style' => 'gemini-2.0-flash-exp',
    'melody-ideas' => 'gemini-2.0-flash-exp',
    'chord-progression' => 'gemini-2.0-flash-exp',
    'translate-english' => 'gemini-2.0-flash-exp',
    'suno-prompt' => 'gemini-2.0-flash-exp',
    'translate' => 'gemini-2.0-flash-exp',
    'chat' => 'gemini-2.0-flash-exp',
    'lyrics-gen' => 'gemini-2.0-flash-exp'
];

$model = $modelMap[$mode] ?? 'gemini-2.0-flash-exp';

// System instruction mode alapján
$systemInstructions = [
    'lyrics-gen' => 'Te egy PROFI MAGYAR KÖLTŐ vagy, aki Suno AI-hoz készít dalszövegeket.

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
8. CSAK a dalszöveg legyen a válaszban a jelölésekkel!',

    'music-style' => 'Te egy ZENEI SZAKÉRTŐ vagy. A feladatod, hogy a dalszöveg alapján ajánlj zenei stílusokat, műfajokat, hangulatokat és tempót. Legyél konkrét és praktikus.',

    'melody-ideas' => 'Te egy ZENESZERZŐ vagy. A feladatod, hogy dallam ötleteket adj a dalszöveghez: milyen legyen a dallam íve, ritmus, hangterjedelme, karaktere. Adj konkrét javaslatokat.',

    'chord-progression' => 'Te egy HARMONIZÁLÓ SZAKÉRTŐ vagy. A feladatod, hogy akkord progressziókat ajánlj a dalszöveghez különböző hangnemekben. Adj meg konkrét akkord sorokat (pl. C - Am - F - G) és magyarázd el, miért illenek a dalhoz.',

    'translate' => 'Te egy PROFI FORDÍTÓ vagy, aki dalszövegeket fordít. Ügyelj a természetes nyelvre és a pontos jelentésre. Csak a fordítást add meg, semmi mást.',

    'suno-prompt' => 'Te egy SUNO AI STYLE PROMPT SZAKÉRTŐ vagy. A feladatod, hogy CSAK a zenei stílus, hangulat, hangszerelés leírását add meg ANGOL NYELVEN. NE írj dalszöveget! NE használj [Verse], [Chorus] jelöléseket! CSAK egyszerű, folyamatos leírás.'
];

$systemInstruction = $systemInstructions[$mode] ?? $systemInstructions['lyrics-gen'];

// Gemini API hívás
try {
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$GEMINI_API_KEY}";

    // Request body összeállítása
    $requestBody = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ],
        'systemInstruction' => [
            'parts' => [
                ['text' => $systemInstruction]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.9,
            'topP' => 0.95,
            'topK' => 64,
            'maxOutputTokens' => 2048
        ]
    ];

    // Képgenerálás esetén más a beállítás
    if ($mode === 'image-gen') {
        $enhancedPrompt = $prompt . '. FONTOS: A képen NE legyen SEMMIFÉLE szöveg, felirat, betű vagy írás! Csak vizuális elemek legyenek: tárgyak, természet, hangszerek, jelenetek. Fotorealisztikus stílus, művészi borítókép, 2:3 (portrait) formátum.';
        $requestBody['contents'][0]['parts'][0]['text'] = $enhancedPrompt;
    }

    // cURL hívás
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // SSL ellenőrzés kikapcsolása Windows-hoz
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $curlErrno = curl_errno($ch);
    curl_close($ch);

    // cURL hiba ellenőrzés
    if ($curlError || $curlErrno) {
        http_response_code(500);
        echo json_encode([
            'error' => 'cURL error: ' . ($curlError ?: 'Unknown'),
            'errno' => $curlErrno,
            'http_code' => $httpCode
        ]);
        exit;
    }

    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode([
            'error' => "Gemini API error: HTTP $httpCode",
            'response' => substr($response, 0, 500)
        ]);
        exit;
    }

    $data = json_decode($response, true);

    // Képgenerálás esetén
    if ($mode === 'image-gen') {
        if (isset($data['candidates'][0]['content']['parts'])) {
            foreach ($data['candidates'][0]['content']['parts'] as $part) {
                if (isset($part['inlineData']['data'])) {
                    echo json_encode([
                        'image' => $part['inlineData']['data'],
                        'mimeType' => $part['inlineData']['mimeType'] ?? 'image/jpeg'
                    ]);
                    exit;
                }
            }
        }
        throw new Exception('Nem sikerült a képet generálni');
    }

    // Szöveges válasz
    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
        $text = $data['candidates'][0]['content']['parts'][0]['text'];
        echo json_encode(['message' => trim($text)]);
    } else {
        throw new Exception('Empty response from AI model');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
