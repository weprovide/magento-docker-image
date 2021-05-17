/**
 * Responsible for retrieving available PHP tags from Docker Hub and parsing them into readable / useable objects
 */

const axios = require('axios');
const child_process = require('child_process');

const fetchToken = (image) => {
    // TODO: add error handling in case "token" is not set in the response body

    // TODO: for some reason using Axios causes the token being returned not to be valid (a 401 request)
    const response = child_process.execSync(`curl --silent --get --data-urlencode "service=registry.docker.io" --data-urlencode "scope=repository:${image}:pull" https://auth.docker.io/token`, { encoding: 'utf8' });
    return JSON.parse(response).token;

    /*return axios.get('https://auth.docker.io/token', {
        service: 'registry.docker.io',
        scope: `repository:${image}:pull`
    }).then(response => response.data.token);*/
}

const fetchTags = async (image) => {
    const token = await fetchToken(image);

    // TODO: add error handling in case "tags" is not set in the response body

    return axios.get(`https://registry-1.docker.io/v2/${image}/tags/list`, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => response.data.tags);
};

// TODO: clean up this code
module.exports = async () => {
    let tags = await fetchTags('library/php');

    tags = tags.map(tag => {
        if (!tag.match(/\d+\.\d+\.\d+-[a-zA-Z0-9]+-[a-zA-Z0-9]+/)) {
            return null;
        }

        const [ version, type, arch ] = tag.split('-');

        // only "fully qualified" tags ("{major}.{minor}.{patch}-{fpm|cli|zts}-{buster|alpine|alpine3.13|alpine3.12")
        if (typeof version === 'undefined' || typeof type === 'undefined' || typeof arch === 'undefined') {
            return null;
        }

        return { version, type, arch };
    }).filter(tag => tag !== null);

    return tags;
};

module.exports();