const path = require('path')
module.exports = {
    lintOnSave: false,
    // baseUrl: './',
    runtimeCompiler: true,
    // chainWebpack: (config) => {
    //     const svgRule = config.module.rule('svg')
    //         // 清除已有的所有 loader。
    //         // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    //     svgRule.uses.clear()
    //     svgRule
    //         .test(/\.svg$/)
    //         .include.add(path.resolve(__dirname, './src/assets/icons/svg'))
    //         .end()
    //         .use('svg-sprite-loader')
    //         .loader('svg-sprite-loader')
    //         .options({
    //             symbolId: 'icon-[name]',
    //         })

    //     const fileRule = config.module.rule('file')
    //     fileRule.uses.clear()
    //     fileRule
    //         .test(/\.svg$/)
    //         .exclude.add(path.resolve(__dirname, './src/assets/icons/svg'))
    //         .end()
    //         .use('file-loader')
    //         .loader('file-loader')
    // },
    devServer: {
        port: 8081,
        // open: true, // 配置自动启动浏览器
        hot: true, //自动保存
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico',
        },
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/styles/color.less')],
        },
    },
}