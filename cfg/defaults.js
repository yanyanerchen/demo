let path = require('path');
let defaults = require('./defaults');
// 解析参数
let args = require('minimist')(process.argv.slice(2));
let env = args.env ? args.env : 'dev';


module.exports = {
	defaultPort: 8003,
	allowedEnvs: ['dev', 'dist', 'test'],
	env: env,
	srcPath: path.join(__dirname, '/../src'),
	publicPath: '/dist/'
}