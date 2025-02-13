const base = import.meta.env.VITE_BASE_URL

export default {
  categories: {
    url: `${base}/dj/catelist`,
    type: 'GET'
  },
  categoryRecommendation: {
    url: `${base}/dj/recommend/type`,
    type: 'GET'
  },
  categoryHot: {
    url: `${base}/dj/radio/hot`,
    type: 'GET'
  },
  requestHotAnchor: {
    url: `${base}/dj/hot/anchor`,
    type: 'GET'
  },
  detail: {
    url: `${base}/dj/detail`,
    type: 'GET'
  },
  programs: {
    url: `${base}/dj/program`,
    type: 'GET'
  }
}
