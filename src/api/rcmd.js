const base = import.meta.env.VITE_BASE_URL

export default {
  /**
   * 每日推荐歌单
   */
  playlist: {
    url: `${base}/recommend/resource`,
    type: 'GET'
  },
  /**
   * 每日推荐歌曲
   */
  songs: {
    url: `${base}/recommend/songs`,
    type: 'GET'
  }
}
