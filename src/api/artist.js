const base = import.meta.env.VITE_BASE_URL

export default {
  // 热门歌手
  top: {
    url: `${base}/top/artists`
  },
  // 歌手分类列表
  list: {
    url: `${base}/artist/list`,
    type: 'GET'
  },
  songs: {
    url: `${base}/artists`,
    type: 'GET'
  },
  // 歌手详情
  detail: {
    url: `${base}/artist/detail`,
    type: 'GET'
  },
  // 歌手热门50首歌曲
  artistTop: {
    url: `${base}/artist/top/song`,
    type: 'GET'
  },
  album: {
    url: `${base}/artist/album`,
    type: 'GET'
  },
  mv: {
    url: `${base}/artist/mv`,
    type: 'GET'
  },
  desc: {
    url: `${base}/artist/desc`,
    type: 'GET'
  },
  // 相似歌手
  similar: {
    url: `${base}/simi/artist`,
    type: 'GET'
  },
  // 收藏/取消收藏歌手 id:id,t:1 为收藏,其他为取消收藏
  subscribe: {
    url: `${base}/artist/sub`,
    type: 'GET'
  }
}
