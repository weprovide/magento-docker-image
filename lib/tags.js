#!/usr/bin/env node
const parseSemver = require('semver/functions/parse');
const coerceSemver = require('semver/functions/coerce');
const findMaxSatisfying = require('semver/ranges/max-satisfying');

module.exports = function (versions) {
    return versions.map(version => {
        const magentoSemver = parseSemver(version.magento);
        const phpSemver = parseSemver(coerceSemver(version.php));

        const maxSatisfyingMagentoVersion = findMaxSatisfying(versions.map(version => version.magento), `~${magentoSemver.major}.${magentoSemver.minor}`);
        const maxSatisfyingPhpVersion = findMaxSatisfying(versions.filter(versionBeingFiltered => {
            // only get the PHP versions applicable to the Magento version
            return version.magento === versionBeingFiltered.magento;
        }).map(version => version.php).map(coerceSemver), '');

        const tags = [];

        if (phpSemver.toString() === maxSatisfyingPhpVersion.toString()) {
            if (version.variant === 'buster') {
                // e.g. "2.4.2"
                tags.push(version.magento);
            }

            // e.g. "2.4.2-alpine"
            tags.push(`${version.magento}-${version.variant}`);
        }

        if (version.variant === 'buster') {
            // e.g. "2.4.2-php-7.3"
            tags.push(`${version.magento}-php-${version.php}`);
        }

        // e.g. "2.4.2-php-7.3-alpine"
        tags.push(`${version.magento}-php-${version.php}-${version.variant}`);
    
        if (version.magento === maxSatisfyingMagentoVersion.toString()) {
            if (version.variant === 'buster') {
                // e.g. "2.4-php-7.3"
                tags.push(`${magentoSemver.major}.${magentoSemver.minor}-php-${version.php}`);
            }

            // e.g. "2.4-php-7.3-alpine"
            tags.push(`${magentoSemver.major}.${magentoSemver.minor}-php-${version.php}-${version.variant}`);

            if (phpSemver.toString() === maxSatisfyingPhpVersion.toString()) {
                if (version.variant === 'buster') {
                    // e.g. "2.4"
                    tags.push(`${magentoSemver.major}.${magentoSemver.minor}`);
                }

                // e.g. "2.4-alpine"
                tags.push(`${magentoSemver.major}.${magentoSemver.minor}-${version.variant}`);
            }

            if (version.variant === 'buster') {
                // e.g. "2.4-php-7.3"
                tags.push(`${magentoSemver.major}.${magentoSemver.minor}-php-${version.php}`);
            }

            // e.g. "2.4-php-7.3-alpine"
            tags.push(`${magentoSemver.major}.${magentoSemver.minor}-php-${version.php}-${version.variant}`);
        }
    
        return { version, tags };
    });
}

/**
 * "php-7.4" is the default php version (depending on the available versions)
 * "buster" is the default variant
 * 
 * serializator/magento:2.4         => serializator/magento:2.4.2-php-7.4-buster
 * serializator/magento:2.4-php-7.3 => serializator/magento:2.4.2-php-7.3-buster
 * serializator/magento:2.3         => serializator/magento:2.3.6-php-7.3-buster
 * serializator/magento:2.3-alpine  => serializator/magento:2.3.6-php-7.3-alpine3.13
 * 
 */

// console.log(test(['2.3.0', '2.3.1', '2.3.2', '2.3.3', '2.3.4', '2.3.5', '2.3.6', '2.4.0', '2.4.1', '2.4.2']));

/* console.log(module.exports([
    {
        magento: '2.4.2',
        php: '7.4',
        variant: 'buster'
    },
    {
        magento: '2.4.2',
        php: '7.4',
        variant: 'alpine3.13'
    },
    {
        magento: '2.4.2',
        php: '7.4',
        variant: 'alpine3.12'
    },
    {
        magento: '2.4.2',
        php: '7.3',
        variant: 'buster'
    },
    {
        magento: '2.4.2',
        php: '7.3',
        variant: 'alpine3.13'
    },
    {
        magento: '2.4.2',
        php: '7.3',
        variant: 'alpine3.12'
    },
    {
        magento: '2.4.2',
        php: '7.3',
        variant: 'stretch'
    },
    


    {
        magento: '2.4.1',
        php: '7.4',
        variant: 'buster'
    },
    {
        magento: '2.4.1',
        php: '7.4',
        variant: 'alpine3.13'
    },
    {
        magento: '2.4.1',
        php: '7.4',
        variant: 'alpine3.12'
    },
    {
        magento: '2.4.1',
        php: '7.3',
        variant: 'buster'
    },
    {
        magento: '2.4.1',
        php: '7.3',
        variant: 'alpine3.13'
    },
    {
        magento: '2.4.1',
        php: '7.3',
        variant: 'alpine3.12'
    },
    {
        magento: '2.4.1',
        php: '7.3',
        variant: 'stretch'
    },




    {
        magento: '2.3.5',
        php: '7.3',
        variant: 'buster'
    },
    {
        magento: '2.3.5',
        php: '7.3',
        variant: 'alpine3.13'
    },
    {
        magento: '2.3.5',
        php: '7.3',
        variant: 'alpine3.12'
    },
])); */