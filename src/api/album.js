const base = import.meta.env.VITE_BASE_URL

export default {
  newest: {
    url: `${base}/album/newest`,
    type: 'GET'
  },
  allNew: {
    url: `${base}/album/new`
  },
  detail: {
    url: `${base}/album`,
    type: 'GET'
  }
}
