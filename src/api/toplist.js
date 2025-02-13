const base = import.meta.env.VITE_BASE_URL

export default {
  rankList: {
    url: `${base}/playlist/detail`,
    type: 'GET'
  },
  all: {
    url: `${base}/toplist`,
    type: 'GET'
  }
}
