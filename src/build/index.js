const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const semver = require('semver');

module.exports = async (jobs) => {
    const dockerfile = fs.readFileSync(path.join(__dirname, '../../Dockerfile.template'), { encoding: 'utf-8' });
    
    // TODO: make this run in parallel
    jobs.forEach(({ magento, php, tags }) => {
        const templated = _.template(dockerfile)({ magento, php, semver });

        // TODO: build image from Dockerfile
        // TODO: tag the image with all tags
    })

    // TODO: push all tags
};