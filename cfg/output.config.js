let defaults = require('./defaults');
let path = require('path');

module.exports = {
	path: path.join(__dirname, '/../dist/'),
	filename: '[name]/entry.js',
	publicPath: defaults.publicPath
}
