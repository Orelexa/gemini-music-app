<?php
/**
 * cURL Diagnosztikai Teszt
 * Ellenőrzi, hogy a PHP cURL képes-e HTTPS kéréseket küldeni
 */

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 1. Ellenőrizzük, hogy a cURL extension telepítve van-e
if (!function_exists('curl_init')) {
    echo json_encode([
        'error' => 'cURL extension NINCS engedélyezve a PHP-ban!',
        'solution' => 'Engedélyezd a php_curl.dll-t a php.ini fájlban'
    ]);
    exit;
}

echo json_encode([
    'step1' => 'cURL extension: OK',
    'curl_version' => curl_version()
]) . "\n\n";

// 2. Egyszerű HTTP teszt (Google)
echo "Teszt 2: HTTP kérés...\n";
$ch = curl_init('http://www.google.com');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$errno = curl_errno($ch);
curl_close($ch);

echo json_encode([
    'step2' => 'HTTP teszt',
    'http_code' => $httpCode,
    'error' => $error ?: 'nincs',
    'errno' => $errno,
    'response_length' => strlen($response),
    'success' => $httpCode === 200
]) . "\n\n";

// 3. HTTPS teszt (Google)
echo "Teszt 3: HTTPS kérés SSL ellenőrzéssel...\n";
$ch = curl_init('https://www.google.com');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$errno = curl_errno($ch);
curl_close($ch);

echo json_encode([
    'step3' => 'HTTPS teszt (SSL verify ON)',
    'http_code' => $httpCode,
    'error' => $error ?: 'nincs',
    'errno' => $errno,
    'response_length' => strlen($response),
    'success' => $httpCode === 200
]) . "\n\n";

// 4. HTTPS teszt SSL ellenőrzés NÉLKÜL
echo "Teszt 4: HTTPS kérés SSL ellenőrzés NÉLKÜL...\n";
$ch = curl_init('https://www.google.com');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$errno = curl_errno($ch);
curl_close($ch);

echo json_encode([
    'step4' => 'HTTPS teszt (SSL verify OFF)',
    'http_code' => $httpCode,
    'error' => $error ?: 'nincs',
    'errno' => $errno,
    'response_length' => strlen($response),
    'success' => $httpCode === 200
]) . "\n\n";

// 5. Gemini API teszt (csak a kapcsolat, nem a válasz tartalma)
echo "Teszt 5: Gemini API elérhetőség...\n";
$testKey = 'test123'; // Rossz kulcs, de legalább látjuk, eléri-e a szervert
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={$testKey}";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'contents' => [['parts' => [['text' => 'test']]]]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$errno = curl_errno($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo json_encode([
    'step5' => 'Gemini API kapcsolat teszt',
    'http_code' => $httpCode,
    'error' => $error ?: 'nincs',
    'errno' => $errno,
    'response_preview' => substr($response, 0, 200),
    'total_time' => $info['total_time'],
    'namelookup_time' => $info['namelookup_time'],
    'connect_time' => $info['connect_time'],
    'success' => $httpCode > 0
]) . "\n\n";

echo "\n=== ÖSSZEFOGLALÓ ===\n";
if ($httpCode === 0) {
    echo json_encode([
        'diagnózis' => 'cURL nem tud kimenő HTTPS kapcsolatot létrehozni',
        'lehetséges_okok' => [
            '1. OpenSSL nincs telepítve vagy nem elérhető',
            '2. Firewall blokkolja a kimenő HTTPS forgalmat',
            '3. php_curl.dll nem megfelelően van konfigurálva',
            '4. CA tanúsítvány bundle hiányzik'
        ],
        'javasolt_megoldás' => 'Ellenőrizd a Laragon OpenSSL beállításait és a php.ini curl.cainfo értékét'
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        'diagnózis' => 'cURL működik! Az API kulcs lehet hibás vagy a kérés formátuma.',
        'http_code' => $httpCode
    ], JSON_PRETTY_PRINT);
}
