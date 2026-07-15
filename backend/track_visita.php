<?php
error_reporting(0); ini_set('display_errors', 0);

$raw = file_get_contents('php://input');
if (strlen($raw) > 10240) { http_response_code(413); echo json_encode(["error"=>"Payload demasiado grande"]); exit; }

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$data    = json_decode($raw, true) ?: [];
$pagina  = trim(strip_tags($data['pagina']  ?? ''));
$ua      = trim(substr($data['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500));
$referer = trim(substr($data['referer']    ?? $_SERVER['HTTP_REFERER']    ?? '', 0, 500));
$ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if (empty($pagina)) { http_response_code(400); echo json_enc(["error"=>"pagina requerida"]); exit; }

// Hashear la IP (nunca se guarda la IP real)
$salt   = 'NyF_SALT_2026_K3y';
$ipHash = hash('sha256', $ip . $salt);

// Detección de bot por User-Agent
$botPatterns = ['/curl/i','/wget/i','/python-requests/i','/python-urllib/i','/go-http-client/i','/nmap/i','/sqlmap/i','/nikto/i','/masscan/i','/zgrab/i','/scan/i','/nessus/i','/headless/i','/phantom/i','/selenium/i','/^$/'];
$esBot = false;
foreach ($botPatterns as $pat) {
    if (preg_match($pat, $ua)) { $esBot = true; break; }
}
if (!$esBot && (empty($ua) || empty($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''))) {
    $esBot = true;
}

// Rate limiting: >60req/min o >1000req/hora en caliente (usando IP real, no hash)
$rMin = $pdo->prepare("SELECT COUNT(*) FROM visitas WHERE ip_hash = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
$rMin->execute([$ipHash]);
$rHora = $pdo->prepare("SELECT COUNT(*) FROM visitas WHERE ip_hash = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
$rHora->execute([$ipHash]);

if ($rMin->fetchColumn() > 60 || $rHora->fetchColumn() > 1000) {
    http_response_code(429);
    echo json_enc(["error" => "Demasiadas solicitudes", "bloqueado" => true]);
    exit;
}

// No loggear bots
if ($esBot) {
    echo json_enc(["success" => true, "es_bot" => true]);
    exit;
}

// Deduplicación: misma IP (hash) + misma página en < 1 hora = no cuenta nueva visita
$dup = $pdo->prepare("SELECT COUNT(*) FROM visitas WHERE ip_hash = ? AND pagina = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
$dup->execute([$ipHash, $pagina]);
if ($dup->fetchColumn() > 0) {
    echo json_enc(["success" => true, "duplicada" => true]);
    exit;
}

// Registrar visita
$stmt = $pdo->prepare("INSERT INTO visitas (ip_hash, pagina, user_agent, referer, es_bot) VALUES (?, ?, ?, ?, 0)");
$stmt->execute([$ipHash, $pagina, $ua, $referer]);

echo json_enc(["success" => true]);
