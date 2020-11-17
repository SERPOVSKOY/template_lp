const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');
const flexbug = require('postcss-flexbugs-fixes');

module.exports = {
    plugins: [
        flexbug,
        autoprefixer,
        mqpacker({
            sort: true,
        }),
        cssnano,
    ],
};
