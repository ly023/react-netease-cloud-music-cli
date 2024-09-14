import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import vitePluginReactCssModules from '@roeefl/vite-plugin-react-css-modules'
import postcssPresetEnv from 'postcss-preset-env'
import path from 'path'
import apiMocker from 'mocker-api'

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const PORT = 3101
const CSS_MODULE_LOCAL_IDENT_NAME = '[folder]-[local]-[hash:base64:5]'

export default ({ mode }) => {
  return defineConfig({
    define: {
      'process.env.NODE_ENV': `"${mode}"`
    },
    plugins: [
      react({
        include: /\.(js|jsx|ts|tsx)$/,
        //babelrc: true, // Use .babelrc files
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-optional-chaining'
          ]
        }
      }),
      tsconfigPaths(),
      vitePluginReactCssModules()
    ],
    esbuild: {
      include: /\.[jt]sx?$/,
      exclude: [],
      loader: 'tsx'
      // jsxInject: `import React from 'react'`
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx'
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          postcssPresetEnv({
            // stage: 0 // 默认stage 2
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import 'style/variable.scss';`,
          esModule: false
        }
      },
      modules: {
        // 是对css模块化的默认行为进行覆盖
        localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
        scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
        generateScopedName: CSS_MODULE_LOCAL_IDENT_NAME
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      open: true,
      port: PORT,
      host: '0.0.0.0',
      onBeforeSetupMiddleware: function ({ app }) {
        apiMocker(app, path.resolve('src/mock/index.js'))
      },
      proxy: {
        // webpack-dev-server反向代理，基于Node代理中间件http-proxy-middleware实现
        '/base': {
          target: 'http://localhost:5023',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/base/, ''),
          secure: false // 设置支持https协议的代理
        }
      }
    },
    resolve: {
      alias: {
        actions: resolve('src/actions'),
        assets: resolve('src/assets'),
        api: resolve('src/api'),
        components: resolve('src/components'),
        config: resolve('src/config'),
        constants: resolve('src/constants'),
        hoc: resolve('src/hoc'),
        hook: resolve('src/hook'),
        reducers: resolve('src/reducers'),
        router: resolve('src/router'),
        sagas: resolve('src/sagas'),
        services: resolve('src/services'),
        store: resolve('src/store'),
        style: resolve('src/style'),
        utils: resolve('src/utils'),
        pages: resolve('src/pages')
      }
    }
  })
}
