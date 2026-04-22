<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

 $data = json_decode(file_get_contents("php://input"));
 $action = $data->action ?? '';

 $SMTP_HOST = "smtp.gmail.com";
 $SMTP_PORT = 587;
 $SMTP_USER = "alejo.sotomayor0411@gmail.com";
 $SMTP_PASS = "vsufqurepdjskxwu";
 $FROM_NAME = "Numeros y Futbol";

// ============================================
// ACCIÓN 1: ENVIAR CÓDIGO
// ============================================
if ($action === "send_code") {

    $email = trim(strtolower($data->email ?? ''));

    if (!$email) {
        echo json_encode(["success" => false, "error" => "El correo es obligatorio"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email=?");
    $stmt->execute([$email]);

    if (!$stmt->fetch()) {
        echo json_encode(["success" => false, "error" => "No existe una cuenta con ese correo"]);
        exit;
    }

    $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $token = bin2hex(random_bytes(32));

    $limpiar = $conn->prepare("DELETE FROM reset_tokens WHERE email=?");
    $limpiar->execute([$email]);

    $insert = $conn->prepare("INSERT INTO reset_tokens (email, token, codigo, expira_en) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))");
    $insert->execute([$email, $token, $codigo]);

    require_once "PHPMailer/src/PHPMailer.php";
    require_once "PHPMailer/src/SMTP.php";
    require_once "PHPMailer/src/Exception.php";

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = $SMTP_HOST;
        $mail->Port       = $SMTP_PORT;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->SMTPAuth   = true;
        $mail->Username   = $SMTP_USER;
        $mail->Password   = $SMTP_PASS;
        $mail->setFrom($SMTP_USER, $FROM_NAME);
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = "Recuperacion de contrasena - Numeros y Futbol";
        $mail->CharSet = "UTF-8";

        // HEREDOC: Las llaves {} del CSS no rompen PHP aquí
                $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#060910;font-family:Segoe UI,Arial,sans-serif;-webkit-text-size-adjust:none;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060910;">
<tr><td align="center" style="padding:30px 10px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;">

    <tr><td style="background:linear-gradient(90deg,#b91c1c,#7c3aed,#1d4ed8);height:7px;border-radius:22px 22px 0 0;font-size:0;line-height:0;">-</td></tr>

    <tr>
        <td style="background:linear-gradient(180deg,#0d1117,#0f172a);padding:50px 30px 35px 30px;text-align:center;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">

            <table cellpadding="0" cellspacing="0" border="0" style="margin:10px auto 40px auto;">
    <tr>
        <td align="center" valign="middle"
            style="width:100px;height:100px;
            background:radial-gradient(circle at 35% 35%,#1e40af,#0f172a);
            border-radius:50%;
            border:3px solid #2563eb;
            text-align:center;
            overflow:hidden;
            box-shadow:0 0 35px rgba(37,99,235,0.4),0 0 70px rgba(37,99,235,0.15);">

            <img src="https://z-cdn-media.chatglm.cn/files/e7a0d70d-d782-469b-b96e-f5784f834623.png?auth_key=1870909668-3553d69b915747fd9924cb2f33dc7b2f-0-b54f8e47892d52b83bab715f69eacd2b"
                 width="120"
                 style="display:block;margin:0 auto;border:0;outline:none;height:auto;" />

        </td>
    </tr>
</table>

            <h1 style="margin:0 0 10px 0;font-size:38px;font-weight:900;letter-spacing:2px;">
                <span style="color:#f87171;">Números</span>
                <span style="color:#94a3b8;"> y </span>
                <span style="color:#60a5fa;">Fútbol</span>
            </h1>
            <p style="margin:0;font-size:14px;color:#475569;letter-spacing:6px;text-transform:uppercase;font-weight:600;">Sistema de Acceso Seguro</p>

            <table cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0 auto;">
                <tr>
                    <td style="width:40px;height:3px;background:#b91c1c;border-radius:2px;"></td>
                    <td style="width:12px;"></td>
                    <td style="width:70px;height:3px;background:linear-gradient(90deg,#7c3aed,#2563eb);border-radius:2px;"></td>
                    <td style="width:12px;"></td>
                    <td style="width:40px;height:3px;background:#1d4ed8;border-radius:2px;"></td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td style="background:linear-gradient(180deg,#0f172a,#0d1117);padding:42px 30px 50px 30px;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">

            <h2 style="margin:0 0 12px 0;font-size:26px;font-weight:700;color:#e2e8f0;text-align:center;">Recuperación de Contraseña</h2>
            <p style="margin:0 0 38px 0;font-size:17px;color:#64748b;text-align:center;line-height:1.7;">Usa el siguiente código para restablecer tu acceso.<br>No lo compartas con nadie.</p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background:linear-gradient(135deg,#0d0d1a,#080e1a);border:1px solid #1e293b;border-radius:18px;padding:44px 20px;text-align:center;">

                        <p style="margin:0 0 28px 0;font-size:13px;color:#475569;text-transform:uppercase;letter-spacing:6px;font-weight:700;">Código de Verificación</p>

                        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                            <tr>
                                <td style="background:linear-gradient(135deg,#1e293b,#0f172a);border:2px solid #334155;border-radius:16px;padding:28px 54px;box-shadow:0 10px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04);">
                                    <span style="font-size:68px;font-weight:900;letter-spacing:20px;color:#f1f5f9;font-family:Courier New,monospace;text-shadow:0 0 30px rgba(96,165,250,0.5),0 2px 4px rgba(0,0,0,0.8);">{$codigo}</span>
                                </td>
                            </tr>
                        </table>

                        <table cellpadding="0" cellspacing="0" border="0" style="margin:30px auto 0 auto;">
                            <tr>
                                <td style="background:#1c0a0a;border:1px solid #3f0f0f;border-radius:28px;padding:10px 26px;">
                                    <span style="font-size:16px;color:#f87171;font-weight:600;letter-spacing:0.5px;">Expira en 15 minutos</span>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:38px 0 34px 0;">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#b91c1c,#7c3aed,#1d4ed8,transparent);"></td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="33%" style="padding:0 6px 0 0;text-align:center;">
                        <div style="background:#120a0a;border:1px solid #2a1010;border-radius:14px;padding:22px 14px;">
                            <p style="margin:0 0 10px 0;font-size:28px;">&#x1F6E1;&#xFE0F;</p>
                            <p style="margin:0 0 5px 0;font-size:15px;color:#f87171;font-weight:700;">Seguro</p>
                            <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Código de un solo uso</p>
                        </div>
                    </td>
                    <td width="33%" style="padding:0 3px;text-align:center;">
                        <div style="background:#0e0a18;border:1px solid #1e1030;border-radius:14px;padding:22px 14px;">
                            <p style="margin:0 0 10px 0;font-size:28px;">&#x26A1;</p>
                            <p style="margin:0 0 5px 0;font-size:15px;color:#a78bfa;font-weight:700;">Rápido</p>
                            <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Válido por 15 minutos</p>
                        </div>
                    </td>
                    <td width="33%" style="padding:0 0 0 6px;text-align:center;">
                        <div style="background:#080f1e;border:1px solid #0f1e38;border-radius:14px;padding:22px 14px;">
                            <p style="margin:0 0 10px 0;font-size:28px;">&#x1F512;</p>
                            <p style="margin:0 0 5px 0;font-size:15px;color:#60a5fa;font-weight:700;">Privado</p>
                            <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">No lo compartas</p>
                        </div>
                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <tr>
        <td style="background:#080c14;padding:28px 30px;text-align:center;border-left:1px solid #1e293b;border-right:1px solid #1e293b;border-bottom:1px solid #1e293b;border-radius:0 0 20px 20px;">
            <p style="margin:0 0 10px 0;font-size:14px;color:#475569;line-height:1.7;">Si no solicitaste este código, puedes ignorar este correo con seguridad.</p>
            <p style="margin:0;font-size:12px;color:#1e293b;font-weight:500;">2025 Números y Fútbol</p>
        </td>
    </tr>

    <tr><td style="background:linear-gradient(90deg,#1d4ed8,#7c3aed,#b91c1c);height:7px;border-radius:0 0 22px 22px;font-size:0;line-height:0;">-</td></tr>

</table>

</td></tr>
</table>

</body>
</html>
HTML;

        $mail->Body = $html;
        $mail->send();

        echo json_encode(["success" => true, "message" => "Codigo enviado correctamente"]);

    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "No se pudo enviar: " . $mail->ErrorInfo
        ]);
    }
    exit;
}

// ============================================
// ACCIÓN 2: VERIFICAR CÓDIGO
// ============================================
if ($action === "verify_code") {

    $email = trim(strtolower($data->email ?? ''));
    $codigo = trim($data->codigo ?? '');

    if (!$email || !$codigo) {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM reset_tokens WHERE email=? AND codigo=? AND usado=0 AND expira_en > NOW()");
    $stmt->execute([$email, $codigo]);
    $token = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$token) {
        echo json_encode(["success" => false, "error" => "Codigo invalido o expirado"]);
        exit;
    }

    echo json_encode(["success" => true, "message" => "Codigo verificado"]);
    exit;
}

// ============================================
// ACCIÓN 3: CAMBIAR CONTRASEÑA
// ============================================
if ($action === "reset_password") {

    $email = trim(strtolower($data->email ?? ''));
    $codigo = trim($data->codigo ?? '');
    $new_password = $data->new_password ?? '';

    if (!$email || !$codigo || !$new_password) {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
        exit;
    }

    if (strlen($new_password) < 6) {
        echo json_encode(["success" => false, "error" => "La nueva contrasena debe tener al menos 6 caracteres"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM reset_tokens WHERE email=? AND codigo=? AND usado=0 AND expira_en > NOW()");
    $stmt->execute([$email, $codigo]);
    $token = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$token) {
        echo json_encode(["success" => false, "error" => "Codigo invalido o expirado. Solicita uno nuevo."]);
        exit;
    }

    $hashedPassword = password_hash($new_password, PASSWORD_BCRYPT);

    $update = $conn->prepare("UPDATE usuarios SET password=? WHERE email=?");
    $update->execute([$hashedPassword, $email]);

    $usado = $conn->prepare("UPDATE reset_tokens SET usado=1 WHERE id=?");
    $usado->execute([$token['id']]);

    echo json_encode(["success" => true, "message" => "Contrasena actualizada correctamente"]);
    exit;
}

echo json_encode(["success" => false, "error" => "Accion no valida"]);