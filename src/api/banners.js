const base = import.meta.env.VITE_BASE_URL

export default {
  banners: {
    url: `${base}/banner`,
    type: 'GET'
  }
}
