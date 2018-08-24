const path=require('path');



module.exports={
    entry: {
        app: './js/res.js',
        book: './js/bookjs/main.js',
        inp:'./js/input/index.js',
        plo:'./js/plot/indexPlot.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use:[
                    {
                        loader: 'babel-loader',
                        options: { presets: ["env"]  }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'ify-loader'
            }

        ]
    }
}