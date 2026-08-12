#!/bin/bash
set -e

echo "Esperando a MySQL en $DB_HOST:$DB_PORT..."

until php -r "
try {
    new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4', getenv('DB_USER'), getenv('DB_PASS'));
    echo 'conectado';
} catch (Exception \$e) {
    exit(1);
}
" 2>/dev/null; do
    echo "   MariaDB aun no listo..."
    sleep 2
done

echo "MariaDB listo. Iniciando Apache..."

mkdir -p /var/www/html/backend/uploads/escudos
chown -R www-data:www-data /var/www/html/backend/uploads

exec "$@"
