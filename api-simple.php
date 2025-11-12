<?php
// Egyszerűsített API teszt
error_reporting(E_ALL);
ini_set('display_errors', 0); // Ne jelenítsen meg hibákat

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Csak POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Input olvasás
$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['prompt'] ?? '';
$mode = $input['mode'] ?? 'lyrics-gen';

// API kulcs - CSERÉLD LE A SAJÁTODRA!
$GEMINI_API_KEY = 'IDE_ÍROD_AZ_API_KULCSOT';

if ($GEMINI_API_KEY === 'IDE_ÍROD_AZ_API_KULCSOT') {
    echo json_encode(['error' => 'API kulcs nincs beállítva! Szerkeszd az api-simple.php fájlt.']);
    exit;
}

if (empty($prompt)) {
    echo json_encode(['error' => 'Prompt is required']);
    exit;
}

// Model választás
$model = 'gemini-2.0-flash-exp';
if ($mode === 'image-gen') {
    $model = 'gemini-2.5-flash-image';
}

// Gemini API hívás
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$GEMINI_API_KEY}";

$requestBody = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.9,
        'maxOutputTokens' => 2048
    ]
];

// cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'cURL error: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    echo json_encode(['error' => "Gemini API error: HTTP $httpCode", 'response' => $response]);
    exit;
}

$data = json_decode($response, true);

// Képgenerálás
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
    echo json_encode(['error' => 'Nem sikerült a képet generálni']);
    exit;
}

// Szöveges válasz
if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
    $text = $data['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['message' => trim($text)]);
} else {
    echo json_encode(['error' => 'Empty response from AI model', 'response' => $data]);
}
