<?php
error_reporting(0); ini_set('display_errors', 0);

$raw = file_get_contents('php://input');
if (strlen($raw) > 8192) { http_response_code(413); echo json_encode(["error"=>"Payload demasiado grande"]); exit; }

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$data         = json_decode($raw, true) ?: [];
$browserToken = trim($data['browser_token'] ?? '');
$ua           = trim(substr($data['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500));
$ip           = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if (empty($browserToken) || strlen($browserToken) !== 36) {
    http_response_code(400);
    echo json_enc(["success" => false, "message" => "browser_token inválido"]);
    exit;
}

$salt   = 'NyF_SALT_2026_K3y';
$ipHash = hash('sha256', $ip . $salt);

$botPatterns = ['/curl/i','/wget/i','/python-requests/i','/python-urllib/i','/go-http-client/i','/nmap/i','/sqlmap/i','/nikto/i','/masscan/i','/zgrab/i','/scan/i','/nessus/i','/headless/i','/phantom/i','/selenium/i','/^$/'];
$esBot = false;
foreach ($botPatterns as $pat) {
    if (preg_match($pat, $ua)) { $esBot = true; break; }
}
if (!$esBot && (empty($ua) || empty($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''))) $esBot = true;
if ($esBot) { echo json_enc(["success" => true, "es_bot" => true]); exit; }

// Rate limiting global para el endpoint
$rateLimit = $pdo->prepare("SELECT COUNT(*) FROM browser_visits WHERE ip_hash = ? AND last_visit > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
$rateLimit->execute([$ipHash]);
if ($rateLimit->fetchColumn() > 30) {
    http_response_code(429);
    echo json_enc(["error" => "Demasiadas solicitudes", "bloqueado" => true]);
    exit;
}

try {
    $pdo->beginTransaction();

    $check = $pdo->prepare("SELECT id, last_visit, visit_count FROM browser_visits WHERE browser_token = ? FOR UPDATE");
    $check->execute([$browserToken]);
    $existing = $check->fetch(PDO::FETCH_ASSOC);

    if (!$existing) {
        $insert = $pdo->prepare("INSERT INTO browser_visits (browser_token, user_agent, ip_hash, first_visit, last_visit, visit_count) VALUES (?, ?, ?, NOW(), NOW(), 1)");
        $insert->execute([$browserToken, $ua, $ipHash]);
        $pdo->commit();
        echo json_enc(["success" => true, "nueva" => true, "message" => "Primera visita registrada"]);
        exit;
    }

    $lastVisit = new DateTime($existing['last_visit']);
    $now       = new DateTime();
    $diffMin   = ($now->getTimestamp() - $lastVisit->getTimestamp()) / 60;

    if ($diffMin >= 60) {
        $update = $pdo->prepare("UPDATE browser_visits SET last_visit = NOW(), visit_count = visit_count + 1, user_agent = ?, ip_hash = ? WHERE browser_token = ?");
        $update->execute([$ua, $ipHash, $browserToken]);
        $pdo->commit();
        echo json_enc(["success" => true, "nueva" => true, "message" => "Visita registrada"]);
        exit;
    }

    $pdo->commit();
    echo json_enc(["success" => true, "duplicada" => true, "message" => "Visita dentro de la ventana de 1 hora"]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}
