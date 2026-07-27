<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

echo json_enc([
    ["id" => 1, "nombre" => "El Salvador Sub-20", "ciudad" => "San Salvador", "estadio" => "Estadio Cuscatlán", "logo" => "uploads/escudo_elsalvador.png", "formacion" => "4-4-2"],
]);
