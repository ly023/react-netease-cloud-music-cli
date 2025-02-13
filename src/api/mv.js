const base = import.meta.env.VITE_BASE_URL

export default {
  // mv详情，?mvid=5436712
  detail: {
    url: `${base}/mv/detail`,
    type: 'GET'
  },
  // mv点赞转发评论数据，?mvid=5436712
  info: {
    url: `${base}/mv/detail/info`,
    type: 'GET'
  },
  // mv地址，?id=10896407&r=1080，r分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
  videoUrl: {
    url: `${base}/mv/url`,
    type: 'GET'
  },
  // 相似mv，?mvid=5436712
  similar: {
    url: `${base}/simi/mv`,
    type: 'GET'
  },
  // 收藏/取消收藏mv mvid:mvid,t:1 为收藏,其他为取消收藏
  subscribe: {
    url: `${base}/mv/sub`,
    type: 'GET'
  }
}
