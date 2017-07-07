let defaults = require('./defaults');
let path = require('path');

let glob = require('glob');
let pagesDir = defaults.srcPath + '/pages';

let options = {
	// 在pages目录里找
  	cwd: pagesDir, 
  	// 这里不能异步，只能同步
  	sync: true, 
};

let globInstance = new glob.Glob('*/*', options);
// 一个数组，形如['activity/mothersday', 'activity/year', 'draw/grid']
let pageArr = globInstance.found;
console.log(pageArr)



var configEntry = {};

pageArr.forEach((page) => {
  	configEntry[page] = [path.resolve(pagesDir, page + '/index')];
});

console.log(configEntry)

/*if (defaults.env == 'dev') {
	for (let chunk in configEntry) {
		configEntry[chunk].push('webpack-dev-server/client?http://127.0.0.1:' + defaults.defaultPort);
	}
}*/

module.exports = configEntry;