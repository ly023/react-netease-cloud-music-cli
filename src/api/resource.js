/**
 * 资源
 */
const base = import.meta.env.VITE_BASE_URL

export default {
  // 资源点赞（mv,电台,视频,动态） type:RESOURCE_TYPE,t: 1 为点赞,其他为取消点赞,id:资源id
  like: {
    url: `${base}/resource/like`,
    type: 'GET'
  }
}
