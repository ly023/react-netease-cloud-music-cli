import { useState, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_AVATAR } from 'constants'
import pubsub from 'utils/pubsub'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { requestDetail, requestDailySignIn } from 'services/user'

import styles from './index.scss'

function Info() {
  const {
    isLogin,
    userInfo: { userId }
  } = useShallowEqualSelector(({ user }) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo
  }))
  const [detail, setDetail] = useState(null)
  const [dailySignInLoading, setDailySignInLoading] = useState(false)
  const [signInSuccess, setSignInSuccess] = useState(false)
  const isMounted = useRef(false)

  const handleCheckIn = () => {
    if (dailySignInLoading) {
      return
    }

    setDailySignInLoading(true)

    const body = {
      type: 1 // 0 为安卓端签到 ,1 为 web/PC 签到
    }

    requestDailySignIn(body)
      .then((res) => {
        if (isMounted.current) {
          setDetail({
            ...detail,
            pcSign: true,
            signInPoint: res.point
          })
          setSignInSuccess(true)
        }
      })
      .catch((err) => {
        // 未登录/重复签到
        toast.error(err.message)
      })
      .finally(() => {
        if (isMounted.current) {
          setTimeout(() => {
            setDailySignInLoading(false)
          }, 2000)
        }
      })
  }

  const handleLogin = () => {
    pubsub.publish('login')
  }

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await requestDetail({ uid: userId })
      if (isMounted.current) {
        setDetail(res)
      }
    }

    if (userId) {
      fetchDetail()
    }
  }, [userId])

  const avatarUrl = detail?.profile?.avatarUrl || ''

  return isLogin && detail ? (
    <div className={styles['my-info']}>
      <div className={`clearfix ${styles.base}`}>
        <Link to={`/user/home/${userId}`} className={styles.avatar}>
          <img
            src={avatarUrl}
            alt="头像"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR
            }}
          />
        </Link>
        <div className={styles.meta}>
          <Link to={`/user/home/${userId}`} className={styles.nickname}>
            {detail?.profile?.nickname}
          </Link>
          <a className={styles.level} href="#">
            {detail?.level}
            <i />
          </a>
          {detail?.pcSign ? (
            <a
              href={null}
              className={`${styles['checkin-btn']} ${styles['checkin-disabled']}`}
            >
              <span>已签到</span>
              <div
                className={`${styles['point-popover']} ${signInSuccess ? styles.fade : ''}`}
              >
                <span className={styles['point-popover-arrow']} />
                <div>
                  获得
                  <span className={styles.point}>{detail?.signInPoint}</span>
                  积分
                </div>
              </div>
            </a>
          ) : (
            <a
              href={null}
              className={`${styles['checkin-btn']} ${styles['checkin']}`}
              onClick={handleCheckIn}
            >
              <span>签到</span>
            </a>
          )}
        </div>
      </div>
      <ul className={styles.summary}>
        <li>
          <Link to="/">
            <strong>{detail?.profile?.eventCount}</strong>
            <span>动态</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <strong>{detail?.profile?.follows}</strong>
            <span>关注</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <strong>{detail?.profile?.followeds}</strong>
            <span>粉丝</span>
          </Link>
        </li>
      </ul>
      <Toaster />
    </div>
  ) : (
    <div className={styles['sign-in']}>
      <p className={styles['sign-in-text']}>
        登录云音乐，可以享受无限收藏的乐趣，并且无限同步到手机
      </p>
      <a href={null} onClick={handleLogin} className={styles['sign-in-btn']}>
        用户登录
      </a>
    </div>
  )
}

export default memo(Info)
