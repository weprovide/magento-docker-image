#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const semver = require('semver');
const _ = require('lodash');
const tags = require('./tags');

const matrix = [];
const semverVersions = JSON.parse(fs.readFileSync(path.join(__dirname, '../versions.json'), { encoding: 'utf-8' }));

// TODO: retrieve these versions using Composer
let magentoVersions = JSON.parse(execSync('composer show --all --format=json magento/project-community-edition')).versions;

const dockerfile = fs.readFileSync(path.join(__dirname, '../Dockerfile.template'), { encoding: 'utf-8' });

let matrixVersions = [];

for (const magentoVersion of magentoVersions) {
    for (const [semverVersion, semverMetrixConfig] of Object.entries(semverVersions)) {
        if (semver.satisfies(magentoVersion, semverVersion)) {
            for (const phpVariant of semverMetrixConfig.php.variants) {
                matrixVersions.push({
                    magento: magentoVersion,
                    php: phpVariant.version,
                    variant: phpVariant.variant
                });
            }

            break;
        }
    }
}

matrixVersions = tags(matrixVersions);

for (const matrixVersion of matrixVersions) {
    matrix.push({
        version: matrixVersion.version.magento,
        php: {
            version: matrixVersion.version.php,
            variant: matrixVersion.version.variant
        },
        tags: matrixVersion.tags,
        dockerfile: _.template(dockerfile)({
            magento: matrixVersion.version.magento,
            php: {
                version: matrixVersion.version.php,
                variant: matrixVersion.version.variant
            },
            semver
        })
    });
}

process.stdout.write(JSON.stringify(matrix));