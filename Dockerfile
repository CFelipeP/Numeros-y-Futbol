FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.2-apache
RUN docker-php-ext-install pdo pdo_mysql mysqli \
 && a2enmod rewrite

COPY --from=builder /app/dist /var/www/html
COPY backend /var/www/html/backend
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
 && mkdir -p /var/www/html/backend/uploads \
 && chown -R www-data:www-data /var/www/html/backend/uploads

ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]
