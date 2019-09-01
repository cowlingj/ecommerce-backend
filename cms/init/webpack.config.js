const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: './src/index.js',

  target: 'node',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [ new webpack.ProgressPlugin() ],

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',
			}
		]
	},
}
