const semver = require("semver");
const getDockerTags = require('./docker');

const getVersions = async () => {
    const versions = [];
    const tags = await getDockerTags('library', 'php');

    for (const { name } of tags) {
        let match = name.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-(.+)-(.+)$/);
        
        if (match === null) {
            continue;
        }

        const version = { version: semver.coerce(`${match[1]}.${match[2]}.${match[3]}`), impl: match[4], arch: match[5] };

        if (versions.includes(version)) {
            continue;
        }
        
        versions.push(version);
    }

    return versions;
};

module.exports = getVersions;