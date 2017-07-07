let webpack = require('webpack');
let defaults = require('./defaults');
let ExtractTextPlugin = require('extract-text-webpack-plugin');


let pluginsConfig = [
	new ExtractTextPlugin("[name]/styles.css"),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'commons/commons',
		filename: '[name]/bundle.js',
	}),
];

if (defaults.env == 'dev') {
	pluginsConfig = pluginsConfig.concat([
		new webpack.HotModuleReplacementPlugin(),
	])
} else {
	pluginsConfig = pluginsConfig.concat([
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
		// 压缩
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
	])
}

module.exports = pluginsConfig;


