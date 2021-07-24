const semver = require('semver');
const getMagentoVersions = require('./magento');
const getPhpVersions = require('./php');

/**
 * A wrote this piece of code with simplicity and readability in mind. I actively kept myself from overuse of 
 * Lambda or whatever other kind of syntactic sugar that could make this code more compact but less readable
 * and thus understandable.
 * 
 * I thought of refactoring the logic for determining the tags for a specific version combination into its own file / function. 
 * I decided not to. If this is really necessary it can always be refactored in the future, otherwise it would be a premature 
 * optimization.
 */

module.exports = async () => {
    const strategy = {};
    let magentoVersions = await getMagentoVersions();
    let phpVersions = (await getPhpVersions()).filter(({ impl }) => ['cli', 'fpm'].includes(impl));

    // TODO: refactor this into a manifest so this can be configured
    magentoVersions = magentoVersions.filter(magentoVersion => semver.satisfies(magentoVersion.version, '^2.3||^2.4'))

    for (const magentoVersion of magentoVersions) {
        strategy[magentoVersion.version.toString()] = [];

        for (const phpVersion of phpVersions) {
            if (semver.satisfies(phpVersion.version, magentoVersion.php)) {
                const tags = [`${magentoVersion.version}-php-${phpVersion.version}-${phpVersion.impl}-${phpVersion.arch}`];

                const isHighestMagentoVersion = semver.maxSatisfying(
                    magentoVersions.map(({ version }) => version),
                    `~${magentoVersion.version.major}.${magentoVersion.version.minor}`
                ).toString() === magentoVersion.version.toString();

                const isHighestPhpVersion = semver.maxSatisfying(
                    phpVersions.map(({ version }) => version),
                    `~${phpVersion.version.major}.${phpVersion.version.minor}`
                ).toString() === phpVersion.version.toString();

                const isPreferredImpl = phpVersion.impl === 'cli';
                const isPreferredArch = phpVersion.arch === 'alpine';

                // add a tag with only MAJOR.MINOR for the latest Magento version ("2.4.2-php-7.4.0-alpine" would be "2.4-php-7.4.0-alpine")
                if (isHighestMagentoVersion) {
                    tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version}-${phpVersion.impl}-${phpVersion.arch}`);

                    if (isPreferredImpl) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version}-${phpVersion.arch}`);
                    }

                    if (isPreferredArch) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version}-${phpVersion.impl}`);
                    }

                    if (isPreferredImpl && isPreferredArch) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version}`);
                    }
                }

                // add a tag with only MAJOR.MINOR for the latest PHP version ("2.4.2-php-7.4.0-alpine" would be "2.4.2-php-7.4-alpine")
                if (isHighestPhpVersion) {
                    tags.push(`${magentoVersion.version}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.impl}-${phpVersion.arch}`);

                    if (isPreferredImpl) {
                        tags.push(`${magentoVersion.version}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.arch}`);
                    }

                    if (isPreferredArch) {
                        tags.push(`${magentoVersion.version}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.impl}`);
                    }

                    if (isPreferredImpl && isPreferredArch) {
                        tags.push(`${magentoVersion.version}-php-${phpVersion.version.major}.${phpVersion.version.minor}`);
                        tags.push(magentoVersion.version.toString());
                    }
                }

                // add a tag with only MAJOR.MINOR for both the latest Magento and PHP version ("2.4.2-php-7.4.0-alpine" would be "2.4-php-7.4-alpine")
                if (isHighestMagentoVersion && isHighestPhpVersion) {
                    tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.impl}-${phpVersion.arch}`);

                    if (isPreferredImpl) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.arch}`);
                    }

                    if (isPreferredArch) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version.major}.${phpVersion.version.minor}-${phpVersion.impl}`);
                    }

                    if (isPreferredImpl && isPreferredArch) {
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}-php-${phpVersion.version.major}.${phpVersion.version.minor}`);
                        tags.push(`${magentoVersion.version.major}.${magentoVersion.version.minor}`);
                    }
                }


                strategy[magentoVersion.version.toString()].push({
                    magentoVersion,
                    phpVersion,
                    tags 
                })
            }
        }
    }

    console.log(JSON.stringify(Object.values(strategy).map(job => {
        return job.map(({ magentoVersion, phpVersion, tags }) => ({
            magento: magentoVersion.version.toString(),
            php: {
                version: phpVersion.version.toString(),
                arch: phpVersion.arch,
                impl: phpVersion.impl
            },
            tags
        }))
    })));
};