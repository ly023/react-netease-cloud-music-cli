const base = import.meta.env.VITE_BASE_URL

export default {
  music: {
    url: `${base}/comment/music`,
    type: 'GET'
  },
  album: {
    url: `${base}/comment/album`,
    type: 'GET'
  },
  playlist: {
    url: `${base}/comment/playlist`,
    type: 'GET'
  },
  // mv评论，?id=5436712, limit, offset
  mv: {
    url: `${base}/comment/mv`,
    type: 'GET'
  },
  // 视频评论, ?id=89ADDE33C0AAE8EC14B99F6750DB954D, limit, offset
  video: {
    url: `${base}/comment/video`,
    type: 'GET'
  },
  // 发送、删除评论
  // t: 0 删除, 1 发送, 2 回复
  // type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频
  // id: 对应资源 id
  // content :要发送的内容
  // commentId :回复的评论id
  comment: {
    url: `${base}/comment`,
    type: 'GET'
  },
  // 给评论点赞
  // id
  // type: 数字,资源类型
  // cid : 评论 id
  // t : 是否点赞, 1 为点赞, 0 为取消点赞
  like: {
    url: `${base}/comment/like`,
    type: 'GET'
  }
}
