const semver = require('semver');

/**
 * Filter "major.minor.patch" versions by their unique "major.minor" combinations, ignoring the patch version.
 * 
 * @param {the versions to get the unique major.minor combinations from} majorMinorPatchVersions 
 * @returns the unique major.minor combinations from the given array
 */
const onlyUniqueMajorMinor = majorMinorPatchVersions => majorMinorPatchVersions
    .map(semver.coerce)
    .map(majorMinorPatchSemver => `${majorMinorPatchSemver.major}.${majorMinorPatchSemver.minor}`)
    .reduce((uniqueMajorMinorVersions, majorMinorVersion) => {
        if (uniqueMajorMinorVersions.indexOf(majorMinorVersion) === -1) {
            uniqueMajorMinorVersions.push(majorMinorVersion);
        }

        return uniqueMajorMinorVersions;
    }, []);

module.exports = (magentoVersions, phpVersions) => {
    magentoVersions = onlyUniqueMajorMinor(magentoVersions);
    
};

module.exports(['2.4.2', '2.4.1'], [
    {
        version: "7.4.16",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.4.16",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.4.16",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.4.16",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.4.16",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.4.16",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.4.16",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.4.16",
        type: "fpm",
        arch: "alpine3.13"
    },
    {
        version: "7.4.17",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.4.17",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.4.17",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.4.17",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.4.17",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.4.17",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.4.17",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.4.17",
        type: "fpm",
        arch: "alpine3.13"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine3.13"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.4",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.4",
        type: "fpm",
        arch: "alpine3.13"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine3.13"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "buster"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine3.12"
    },
    {
        version: "7.3",
        type: "cli",
        arch: "alpine3.13"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "buster"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine3.12"
    },
    {
        version: "7.3",
        type: "fpm",
        arch: "alpine3.13"
    }
]);