
FROM mcr.microsoft.com/devcontainers/php:4-8.5-trixie

# Install MariaDB client
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y mariadb-client \
    && echo "Installed MariaDB client version: $(mysql --version)" \
    && echo "Installed PHP version: $(php -v)" \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP MySQL drivers
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install Node.js v24
RUN curl -fsSL https://deb.nodesource.com/setup_24.x| bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Apache document root permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install NPM packages
RUN npm install 
