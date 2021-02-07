#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const semver = require('semver');
const _ = require('lodash');

const metrix = [];
const semverVersions = JSON.parse(fs.readFileSync(path.join(__dirname, '../versions.json'), { encoding: 'utf-8' }));

// TODO: retrieve these versions using Composer
const magentoVersions = JSON.parse(execSync('composer show --all --format=json magento/project-community-edition')).versions; // ['2.3.5', '2.3.4', '2.3.2', '2.3.1', '2.3.0', '2.4.0', '2.4.1'];

const dockerfile = fs.readFileSync(path.join(__dirname, '../Dockerfile.template'), { encoding: 'utf-8' });

for (const magentoVersion of magentoVersions) {
    for (const [semverVersion, semverMetrixConfig] of Object.entries(semverVersions)) {
        if (semver.satisfies(magentoVersion, semverVersion)) {
            for (const phpVariant of semverMetrixConfig.php.variants) {
                metrix.push({
                    version: magentoVersion,
                    php: phpVariant,
                    dockerfile: _.template(dockerfile)({
                        magento: magentoVersion,
                        php: phpVariant,
                        semver
                    })
                });
            }

            break;
        }
    }
}

/*process.stdout.write(JSON.stringify({
    "version": "2.4.1",
    "php": {
        "version":"7.4",
        "variant":"alpine"
    }
}));*/

process.stdout.write(JSON.stringify(metrix));