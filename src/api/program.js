const base = import.meta.env.VITE_BASE_URL

export default {
  recommendation: {
    url: `${base}/program/recommend`,
    type: 'GET'
  },
  programRank: {
    url: `${base}/dj/program/toplist`,
    type: 'GET'
  },
  detail: {
    url: `${base}/dj/program/detail`,
    type: 'GET'
  }
}
