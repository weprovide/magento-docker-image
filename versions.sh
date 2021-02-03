#!/usr/bin/env bash

# Generate a matrix for GitHub Actions based on versions returned by Composer and the matching semvers in "versions.json"
# Resulting image name would be "serializator/magento:2.4.1-php-7.4-alpine"

# 1. add "https://repo.magento.com" as a global Composer repository
# 2. add some HTTP basic authentication for this repository using the environment variables
# 3. get the versions from "magento/project-community-edition" (ignore patch releases ("-p1" etc))
# 4. map each version to their matching semver version in "versions.json"

# {
#     "include": [
#         {
#             "version": "2.4.1",
#             "tags": [
#                 "magento:2.4.1-php-7.4-alpine",
#                 "magento:2.4-php-7.4-alpine",
#                 "magento:2-php-7.4-alpine",
#                 "magento:2.4-alpine"
#             ],
#             ... configuration from "versions.json" matching this version
#         }
#     ]
# }