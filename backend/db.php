<?php

$conn = new PDO(
    "mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8",
    "root",
    "Info2026/*-"
);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);