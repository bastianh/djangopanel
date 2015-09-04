module.exports = {
    context: __dirname + "/chrome_extension/src",
    entry: {
        panel: './panel.js',
        extension: './extension.js',
        background: './background.js'
    },
    output: {
        path: __dirname + '/chrome_extension/build/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.(json|html|css)$/, loader: 'file?name=[path][name].[ext]'},
            {test: /\.scss$/, loader: 'file?name=[path][name].css!sass'}
        ]
    }
};
