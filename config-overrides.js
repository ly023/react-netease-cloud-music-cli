const {override, useBabelRc, useEslintRc, addDecoratorsLegacy, addBabelPlugins, addWebpackAlias, addWebpackPlugin} = require('customize-cra')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化资源分析
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

const changeModuleRules = () => config => {
    const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    loaders[loaders.length - 3].use.push({
        loader: 'sass-resources-loader',
        options: {
            resources: [resolve('src/style/variable.scss')]
        }
    });

    loaders[loaders.length - 3].use[1].options.modules = true;
    loaders[loaders.length - 3].use[1].options.localIdentName = '[folder]-[local]-[hash:base64:5]';

    return config;
};

module.exports = override(
    // 允许使用.babelrc文件进行babel配置
    useBabelRc(),

    // 许使用.eslintrc
    useEslintRc(),

    // 装饰器，依赖@babel/plugin-proposal-decorators
    addDecoratorsLegacy(),

    ...addBabelPlugins(
        "@babel/plugin-proposal-optional-chaining",
        [
            "react-css-modules",
            {
                "filetypes": {
                    ".scss": {
                        "syntax": "postcss-scss"
                    }
                },
                "exclude": "node_modules",
                "generateScopedName": "[folder]-[local]-[hash:base64:5]",
                "autoResolveMultipleImports": true
            }
        ],
        "lodash"
    ),

    addWebpackPlugin(
        new BundleAnalyzerPlugin({
            // analyzerMode: 'server',
            analyzerMode: 'disabled',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true, // 在默认浏览器中自动打开报告
            generateStatsFile: false, // 是否生成stats.json文件
            statsFilename: 'stats.json',
            logLevel: 'info'
        }),
        new LodashModuleReplacementPlugin()
    ),

    // 配置路径别名
    addWebpackAlias({
        'react-dom': '@hot-loader/react-dom',
        actions: resolve('src/actions'),
        assets: resolve('src/assets'),
        api: resolve('src/api'),
        components: resolve('src/components'),
        config: resolve('src/config'),
        constants: resolve('src/constants'),
        reducers: resolve('src/reducers'),
        router: resolve('src/router'),
        sagas: resolve('src/sagas'),
        services: resolve('src/services'),
        store: resolve('src/store'),
        style: resolve('src/style'),
        utils: resolve('src/utils'),
        pages: resolve('src/pages'),
    }),

    changeModuleRules(),
)
