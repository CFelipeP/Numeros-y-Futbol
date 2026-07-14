#!/bin/bash
set -e

echo "Esperando a MySQL en $DB_HOST:$DB_PORT..."

until php -r "
try {
    new PDO('mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4', '$DB_USER', '$DB_PASS');
    echo 'conectado';
} catch (Exception \$e) {
    exit(1);
}
" 2>/dev/null; do
    echo "   MariaDB aun no listo..."
    sleep 2
done

echo "MariaDB listo. Iniciando Apache..."
exec "$@"
