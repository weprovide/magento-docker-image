const axios = require('axios');

const getTags = (repository, image) => {
    return axios.get(`https://index.docker.io/v1/repositories/${repository}/${image}/tags`).then(response => {
        return response.data;
    });
};

module.exports = getTags;