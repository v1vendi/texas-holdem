const path = require('path');
const webpack = require('webpack')

module.exports = {
	entry: './main.js',
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js',
    },
    devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.js/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
                        presets: ['env'],
                        plugins: ['transform-class-properties']                            
					}
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			mangle: false
		})
	]
};