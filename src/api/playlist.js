/**
 * 歌单
 */
const base = import.meta.env.VITE_BASE_URL

export default {
  category: {
    url: `${base}/playlist/catlist`,
    type: 'GET'
  },
  hotCategory: {
    url: `${base}/playlist/hot`,
    type: 'GET'
  },
  top: {
    url: `${base}/top/playlist`,
    type: 'GET'
  },
  personalized: {
    url: `${base}/personalized`,
    type: 'GET'
  },
  detail: {
    url: `${base}/playlist/detail`,
    type: 'GET'
  },
  similar: {
    url: `${base}/simi/playlist`,
    type: 'GET'
  },
  related: {
    url: `${base}/related/playlist`,
    type: 'GET'
  },
  subscribe: {
    url: `${base}/playlist/subscribe`,
    // type: 'POST'
    type: 'GET'
  },
  // 用户歌单
  userPlaylist: {
    url: `${base}/user/playlist`,
    type: 'GET'
  },
  createUserPlaylist: {
    url: `${base}/playlist/create`,
    type: 'GET'
  },
  updateUserPlaylist: {
    url: `${base}/playlist/update`,
    type: 'GET'
  },
  deleteUserPlaylist: {
    url: `${base}/playlist/delete`,
    type: 'GET'
  },
  updateUserPlaylistSongs: {
    url: `${base}/playlist/tracks`,
    type: 'GET'
  }
}
