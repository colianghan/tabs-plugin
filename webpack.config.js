var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry:[
        './index',
        'webpack/hot/only-dev-server',
    ],
    output:{
       filename:'bundle.js'
    },
    devServer:{
        port:8080,
        host:'localhost',
        hot:false,
        open:true
    },
    module:{
        rules:[{
            test:/.html$/,
            loader:'html-loader'
        },{
            test:/.less$/,
            use:['style-loader','css-loader','less-loader']
        }]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title:'Tabs Pugin demo'
        })
    ]
}