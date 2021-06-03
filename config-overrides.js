const {override, addDecoratorsLegacy, overrideDevServer, addBabelPlugins, addWebpackAlias, addWebpackPlugin} = require('customize-cra')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化资源分析
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const apiMocker = require('mocker-api');
const loaderUtils = require('loader-utils')

const CSS_MODULE_LOCAL_IDENT_NAME = '[folder]-[local]-[hash:base64:5]'

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

function generateScopedName(pattern) {
    const context = process.cwd();
    return function generate(localName, filepath) {
        const name = pattern.replace(/\[local\]/gi, localName);
        const loaderContext = {
            resourcePath: filepath,
        };

        const loaderOptions = {
            content: `${path.relative(context, filepath).replace(/\\/g, '/')}\u0000${localName}`,
            context,
        };

        const genericName = loaderUtils.interpolateName(loaderContext, name, loaderOptions);
        return genericName
            .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
            .replace(/^((-?[0-9])|--)/, '_$1');
    };
}

const changeModuleRules = () => config => {
    const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    loaders[loaders.length - 3].use.push({
        loader: 'sass-resources-loader',
        options: {
            resources: [resolve('src/style/variable.scss')]
        }
    });

    loaders[loaders.length - 3].use[1].options.modules = {
        localIdentName: CSS_MODULE_LOCAL_IDENT_NAME,
    }

    return config;
};

const devServerConfig = () => config => {
    return {
        ...config,
        hot: true,
        before(app) {
            apiMocker(app, path.resolve('src/mock/index.js'))
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                pathRewrite: {'^/api': ''},
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            },
        }
    }
}

module.exports = {
    webpack: override(
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
                    "generateScopedName": generateScopedName(CSS_MODULE_LOCAL_IDENT_NAME),
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

    ),
    devServer: overrideDevServer(
        devServerConfig()
    )
}
