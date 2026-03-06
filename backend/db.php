

<?php

$conn = new PDO(
    "mysql:host=localhost;dbname=numeros-y-futbol;charset=utf8",
    "root",
    ""
);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);