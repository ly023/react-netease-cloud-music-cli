/**
 * 动态
 */
const base = import.meta.env.VITE_BASE_URL

export default {
  // 获取动态消息
  posts: {
    url: `${base}/event`,
    type: 'GET'
  }
}
