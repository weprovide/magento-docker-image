const generateStrategy = require('./strategy');
const build = require('./build');

require('dotenv').config();

(async (args) => {
    const [ action, ...otherArgs ] = args;

    if (action?.toLowerCase() === 'strategy') {
        await generateStrategy();
        return;
    }

    if (action?.toLowerCase() === 'build') {
        const [ job ] = otherArgs;
        await build(JSON.parse(job));
        return;
    }

    console.log('Please specify an action, either "strategy" or "build"');
})(process.argv.slice(2));