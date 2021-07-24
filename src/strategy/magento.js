const semver = require("semver");
const axios = require('axios');

const getVersions = async () => {
    // TODO: use a client for this to remove the duplicate "auth" options and URL

    const manifest = await axios.get('https://repo.magento.com/packages.json', {
        auth: {
            username: process.env.MAGENTO_AUTH_USERNAME,
            password: process.env.MAGENTO_AUTH_PASSWORD
        }
    }).then(({ data }) => data);

    const packages = await axios.get(`https://repo.magento.com/p/provider-ce$${manifest['provider-includes']['p/provider-ce$%hash%.json'].sha256}.json`, {
        auth: {
            username: process.env.MAGENTO_AUTH_USERNAME,
            password: process.env.MAGENTO_AUTH_PASSWORD
        }
    }).then(({ data }) => data);

    const package = await axios.get(`https://repo.magento.com/p/magento/product-community-edition$${packages.providers['magento/product-community-edition'].sha256}.json`, {
        auth: {
            username: process.env.MAGENTO_AUTH_USERNAME,
            password: process.env.MAGENTO_AUTH_PASSWORD
        }
    }).then(({ data }) => data);

    const versions = Object.keys(package.packages['magento/product-community-edition']).filter(version => {
        return version.match(/^\d+\.\d+\.\d+$/) !== null;
    });
    
    return versions.map(version => ({
        version: semver.coerce(version),
        php: package.packages['magento/product-community-edition'][version].require.php
    }));
};

module.exports = getVersions;