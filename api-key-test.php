<?php
/**
 * API Kulcs Ellenőrző
 * Megmutatja, hogy az API kulcs helyesen van-e beállítva
 */

header('Content-Type: application/json');

// API kulcs betöltése környezeti változóból
$GEMINI_API_KEY = getenv('GEMINI_API_KEY_NEW');

if (!$GEMINI_API_KEY) {
    echo json_encode([
        'error' => 'API kulcs nincs beállítva! Állítsd be a GEMINI_API_KEY_NEW környezeti változót.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Ellenőrzések
$results = [];

// 1. Kulcs forrása
if (getenv('GEMINI_API_KEY_NEW')) {
    $results['source'] = 'Környezeti változó (GEMINI_API_KEY_NEW)';
    $results['env_var_set'] = true;
} else {
    $results['source'] = 'Hardcoded érték az api.php-ban';
    $results['env_var_set'] = false;
}

// 2. Kulcs formátuma
$keyLength = strlen($GEMINI_API_KEY);
$results['key_length'] = $keyLength;

if ($GEMINI_API_KEY === 'IDE_MÁSOLD_BE_A_KULCSOT') {
    $results['error'] = 'API kulcs NINCS beállítva! Még mindig a placeholder érték van.';
    $results['key_preview'] = 'IDE_MÁSOLD_BE_A_KULCSOT';
} else {
    // Kulcs első és utolsó 4 karaktere (biztonságos)
    $results['key_preview'] = substr($GEMINI_API_KEY, 0, 8) . '...' . substr($GEMINI_API_KEY, -4);
    $results['key_valid_format'] = strlen($GEMINI_API_KEY) > 20;

    // Ellenőrizzük, hogy nincs-e whitespace
    if (trim($GEMINI_API_KEY) !== $GEMINI_API_KEY) {
        $results['warning'] = 'Az API kulcsban whitespace karakter van az elején vagy végén!';
    }
}

// 3. Teszteljük a Gemini API-t ezzel a kulccsal
if ($GEMINI_API_KEY !== 'IDE_MÁSOLD_BE_A_KULCSOT') {
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={$GEMINI_API_KEY}";

    $requestBody = [
        'contents' => [
            [
                'parts' => [
                    ['text' => 'Hello, this is a test']
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.9,
            'maxOutputTokens' => 50
        ]
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $curlErrno = curl_errno($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $results['api_test'] = [
        'http_code' => $httpCode,
        'curl_error' => $curlError ?: 'nincs',
        'curl_errno' => $curlErrno,
        'total_time' => $info['total_time'],
        'namelookup_time' => $info['namelookup_time'],
        'connect_time' => $info['connect_time']
    ];

    if ($httpCode === 200) {
        $results['api_test']['status'] = '✅ SIKERES! Az API kulcs működik!';
        $data = json_decode($response, true);
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $results['api_test']['response_preview'] = substr($data['candidates'][0]['content']['parts'][0]['text'], 0, 100);
        }
    } elseif ($httpCode === 400) {
        $results['api_test']['status'] = '⚠️ HTTP 400 - Hibás kérés formátum';
        $results['api_test']['response'] = substr($response, 0, 500);
    } elseif ($httpCode === 403 || $httpCode === 401) {
        $results['api_test']['status'] = '❌ HTTP ' . $httpCode . ' - Hibás API kulcs vagy jogosultság';
        $results['api_test']['response'] = substr($response, 0, 500);
    } elseif ($httpCode === 0) {
        $results['api_test']['status'] = '❌ HTTP 0 - A cURL nem tudta elérni a szervert';
        $results['api_test']['possible_causes'] = [
            'Firewall blokkolja',
            'DNS probléma',
            'Timeout',
            'SSL tanúsítvány hiba (pedig ki van kapcsolva...)'
        ];
    } else {
        $results['api_test']['status'] = '❌ HTTP ' . $httpCode . ' - Ismeretlen hiba';
        $results['api_test']['response'] = substr($response, 0, 500);
    }
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
