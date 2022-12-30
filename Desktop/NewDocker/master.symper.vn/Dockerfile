FROM php:7.4-fpm


# Copy the PHP-FPM configuration file
COPY ./www.conf /usr/local/etc/php-fpm.d/www.conf


# Packages
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git \
    zlib1g-dev \
    unzip \
    python \
    && ( \
    cd /tmp \
    && mkdir librdkafka \
    && cd librdkafka \
    && git clone https://github.com/edenhill/librdkafka.git . \
    && ./configure \
    && make \
    && make install \
    ) \
    && rm -r /var/lib/apt/lists/*

# PHP Extensions
# install rdkafka, memcache, opcache, redis
RUN apt-get update -y \
    && apt-get install -y libzip-dev
RUN pecl install -o -f redis \
    &&  rm -rf /tmp/pear \
    &&  docker-php-ext-enable redis
RUN docker-php-ext-install -j$(nproc) zip \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka
RUN apt-get install -y libz-dev libmemcached-dev && \
    apt-get install -y memcached libmemcached-tools && \
    pecl install memcached && \
    docker-php-ext-enable memcached
RUN apt-get update
RUN apt install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql
RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache
RUN apt install -y libpng-dev
RUN docker-php-ext-install gd
#RUN apt-get install -y jq
ADD opcache.ini "$PHP_INI_DIR/conf.d/opcache.ini"
ADD php.ini /usr/local/etc/php/

#EXPOSE 9000
