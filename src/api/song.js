const base = import.meta.env.VITE_BASE_URL

export default {
  // 获取歌曲详情
  detail: {
    url: `${base}/song/detail`,
    type: 'GET'
  },
  // 获取音乐url
  resource: {
    url: `${base}/song/url/v1`,
    type: 'GET'
  },
  // 获取客户端歌曲下载 url
  download: {
    url: `${base}/song/download/url`,
    type: 'GET'
  },
  // 歌词
  lyric: {
    url: `${base}/lyric`,
    type: 'GET'
  },
  similar: {
    url: `${base}/simi/song`
  }
}
