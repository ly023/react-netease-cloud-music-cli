const base = import.meta.env.VITE_BASE_URL

export default {
  qrKey: {
    url: `${base}/login/qr/key`,
    type: 'GET'
  },
  createQr: {
    url: `${base}/login/qr/create`,
    type: 'GET'
  },
  checkQr: {
    url: `${base}/login/qr/check`,
    type: 'GET'
  },
  mobileLogin: {
    url: `${base}/login/cellphone`,
    type: 'POST'
  },
  emailLogin: {
    url: `${base}/login`,
    type: 'POST'
  },
  logout: {
    url: `${base}/logout`,
    type: 'POST'
  },
  // 登录状态
  loginStatus: {
    url: `${base}/login/status`,
    type: 'GET'
  },
  detail: {
    url: `${base}/user/detail`,
    type: 'GET'
  },
  // 获取用户信息 , 歌单，收藏，mv, dj 数量
  subContent: {
    url: `${base}/user/subcount`,
    type: 'GET'
  },
  // 签到
  dailySignIn: {
    url: `${base}/daily_signin`,
    type: 'POST'
  },
  // 用户关注列表
  follows: {
    url: `${base}/user/follows`,
    type: 'GET'
  },
  // 用户听歌排行榜
  listeningRankingList: {
    url: `${base}/user/record`,
    type: 'GET'
  },
  // 用户歌单
  playlist: {
    url: `${base}/user/playlist`,
    type: 'GET'
  },
  // 用户创建的电台
  radios: {
    url: `${base}/user/audio`,
    type: 'GET'
  }
}
