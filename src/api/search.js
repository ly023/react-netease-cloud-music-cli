const base = import.meta.env.VITE_BASE_URL

export default {
  searchSuggest: {
    url: `${base}/search/suggest`,
    type: 'GET'
  },
  search: {
    url: `${base}/search`,
    type: 'GET'
  },
  multimatch: {
    url: `${base}/search/multimatch`,
    type: 'GET'
  }
}
