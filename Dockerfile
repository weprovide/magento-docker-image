ARG PHP
ARG VARIANT
FROM php:${PHP}-cli-${VARIANT}
RUN echo "Hello, World"