<?php
$_SERVER['HTTP_ORIGIN'] = 'http://localhost:5173';
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST['csv_text'] = "nombre,posicion,numero_camiseta,edad,club,partidos_jugados,goles,asistencias,atajadas\nMaria Perez,centrodelantero,9,25,Alianza Women,10,5,3,0";

require __DIR__ . '/importar_jugadores_seleccion_femenina.php';
