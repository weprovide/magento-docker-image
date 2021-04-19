#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const semver = require('semver');
const _ = require('lodash');
const tags = require('./tags');

const matrix = [];
const semverVersions = JSON.parse(fs.readFileSync(path.join(__dirname, '../versions.json'), { encoding: 'utf-8' }));

let magentoVersions = JSON.parse(execSync('composer show --all --format=json magento/project-community-edition')).versions
    .map(semver.parse)
    .map(magentoSemver => `${magentoSemver.major}.${magentoSemver.minor}`)
    .reduce((deduplicated, magentoVersion) => {
        if (deduplicated.indexOf(magentoVersion) === -1) {
            deduplicated.push(magentoVersion);
        }

        return deduplicated;
    }, []);

const dockerfile = fs.readFileSync(path.join(__dirname, '../Dockerfile.template'), { encoding: 'utf-8' });

let matrixVersions = [];

for (const magentoVersion of magentoVersions) {
    for (const [semverVersion, semverMetrixConfig] of Object.entries(semverVersions)) {
        // coerce the "major.minor" notation into "major.minor.patch" so that it can satisfy the semver notation
        if (semver.satisfies(semver.coerce(magentoVersion).toString(), semverVersion)) {
            for (const phpVariant of semverMetrixConfig.php) {
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

// run: echo '${{ matrix.dockerfile }}' | docker build --build-arg PHP=${{ matrix.php.version }} --build-arg VARIANT=${{ matrix.php.variant }} --tag weprovide/magento:${{ matrix.version }}-php-${{ matrix.php.version }}-${{ matrix.php.variant }} -

for (const matrixVersion of matrixVersions) {
    const matrixDockerfile = _.template(dockerfile)({
        magento: matrixVersion.version.magento,
        php: {
            version: matrixVersion.version.php,
            variant: matrixVersion.version.variant
        },
        semver
    });

    const tags = matrixVersion.tags.map(tag => `--tag weprovide/magento:${tag}`).join(' ');

    matrix.push({
        version: matrixVersion.version.magento,
        php: {
            version: matrixVersion.version.php,
            variant: matrixVersion.version.variant
        },
        build: `echo '${matrixDockerfile}' | docker build ${tags} -`});
}

process.stdout.write(JSON.stringify(matrix));