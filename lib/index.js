#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const metrix = [];
const semverVersions = JSON.parse(fs.readFileSync(path.join(__dirname, '../versions.json'), { encoding: 'utf-8' }));

// TODO: retrieve these versions using Composer
const magentoVersions = ['2.3.5', '2.3.4', '2.3.2', '2.3.1', '2.3.0', '2.4.0', '2.4.1'];

for (const magentoVersion of magentoVersions) {
    for (const [semverVersion, semverMetrixConfig] of Object.entries(semverVersions)) {
        if (semver.satisfies(magentoVersion, semverVersion)) {
            for (const phpVariant of semverMetrixConfig.php.variants) {
                metrix.push({
                    version: magentoVersion,
                    php: phpVariant
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