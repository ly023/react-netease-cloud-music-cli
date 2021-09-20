const config = require(`./${process.env.NODE_ENV}.js`).default

export default Object.assign({
    apiHost: '',
}, config)
