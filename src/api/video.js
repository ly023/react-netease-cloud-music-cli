const base = import.meta.env.VITE_BASE_URL

export default {
  // 视频详情，?id=5436712
  detail: {
    url: `${base}/video/detail`,
    type: 'GET'
  },
  // 视频点赞转发评论数据，?vid=5436712
  info: {
    url: `${base}/video/detail/info`,
    type: 'GET'
  },
  // 视频播放地址，?id=89ADDE33C0AAE8EC14B99F6750DB954D
  videoUrl: {
    url: `${base}/video/url`,
    type: 'GET'
  },
  // 相关视频，?id=5436712
  similar: {
    url: `${base}/related/allvideo`,
    type: 'GET'
  },
  // 收藏/取消收藏视频 id:视频id,t:1 为收藏,其他为取消收藏
  subscribe: {
    url: `${base}/video/sub`,
    type: 'GET'
  }
}
