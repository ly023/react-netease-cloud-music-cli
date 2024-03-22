const config = await import(/* @vite-ignore */ `./${process.env.NODE_ENV}.js`)

export default Object.assign(
  {
    apiHost: ''
  },
  config.default
)
