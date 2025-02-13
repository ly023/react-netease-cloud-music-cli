const base = import.meta.env.VITE_BASE_URL

export default {
  countryCodeList: {
    url: `${base}/countries/code/list`,
    type: 'GET'
  }
}
