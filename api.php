<?php
// .env fájl betöltése
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (empty(trim($line))) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) == 2) {
            $name = trim($parts[0]);
            $value = trim($parts[1]);
            putenv("$name=$value");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// API kulcs betöltése
$GEMINI_API_KEY = getenv('GEMINI_API_KEY_NEW');

if (empty($GEMINI_API_KEY)) {
    http_response_code(500);
    echo json_encode(['error' => 'API kulcs nincs beállítva!']);
    exit;
}

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POST request feldolgozása
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Érvénytelen JSON formátum: ' . json_last_error_msg()
    ]);
    exit;
}

if (!isset($data['prompt']) || empty(trim($data['prompt']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Kérlek, adj meg egy témát vagy promptot!']);
    exit;
}

$prompt = $data['prompt'];
$mode = $data['mode'] ?? 'lyrics-gen';

// Képgenerálás mód
if ($mode === 'image-gen') {
    // Gemini 2.5 Flash Image modell képgeneráláshoz
    $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' . $GEMINI_API_KEY;

    // Pontosított prompt felirat nélküli képhez 2:3 arányban
    $enhancedPrompt = $prompt . '.
FONTOS: A képen NE legyen SEMMIFÉLE szöveg, felirat, betű vagy írás!
Csak vizuális elemek legyenek: tárgyak, természet, hangszerek, jelenetek.
Fotorealisztikus stílus, művészi borítókép, 2:3 (portrait) formátum.';

    $requestBody = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $enhancedPrompt]
                ]
            ]
        ]
    ];
} else {
    // Szöveges generálás (dalszöveg, stb.)
    // Gemini 2.0 Flash Experimental (stabil és gyors)
    $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' . $GEMINI_API_KEY;

    $requestBody = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]
    ];
}

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

// SSL beállítások - Laragon környezethez
// Fejlesztési környezetben kikapcsoljuk az SSL verifikációt
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Hálózati hiba: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    $errorMsg = 'Gemini API hiba (HTTP ' . $httpCode . ')';

    // Próbáljuk meg JSON-ként értelmezni a hibát
    $errorData = json_decode($response, true);
    if ($errorData && isset($errorData['error']['message'])) {
        $errorMsg .= ': ' . $errorData['error']['message'];
    } elseif (!empty($response)) {
        $errorMsg .= ': ' . substr($response, 0, 200);
    }

    echo json_encode(['error' => $errorMsg]);
    exit;
}

$result = json_decode($response, true);

// Képgenerálás válasz kezelése
if ($mode === 'image-gen') {
    if (isset($result['candidates'][0]['content']['parts'])) {
        foreach ($result['candidates'][0]['content']['parts'] as $part) {
            if (isset($part['inlineData']['data'])) {
                echo json_encode([
                    'image' => $part['inlineData']['data'],
                    'mimeType' => $part['inlineData']['mimeType'] ?? 'image/jpeg'
                ]);
                exit;
            }
        }
    }
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült a képet generálni']);
    exit;
}

// Szöveges válasz kezelése
if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
    $message = $result['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['message' => $message]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Nem várt API válasz']);
}
?>