/**
 * 电台详情页
 */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import { stringify } from 'qs'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import withRouter from 'hoc/withRouter'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { requestDetail, requestPrograms } from 'services/radio'
import Page from 'components/Page'
import Collapse from 'components/Collapse'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import SinglePlay from 'components/business/SinglePlay'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import ClientDownload from 'components/business/ClientDownload'
import {
  formatDuration,
  formatNumber,
  getThumbnail,
  getUrlPaginationParams,
  getUrlParameters
} from 'utils'
import { PLAY_TYPE } from 'constants/music'

import styles from './index.scss'

const DEFAULT_LIMIT = 100

const ACTION_TYPES = {
  add: '添加到播放列表',
  share: '分享',
  download: '下载'
}

function RadioDetail(props) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const { currentSong } = useShallowEqualSelector(({ user }) => ({
    currentSong: user.player.currentSong
  }))

  const radioId = Number(props.params?.id)

  const [detail, setDetail] = useState(null)
  const [programsLoading, setProgramsLoading] = useState(false)
  const [params, setParams] = useState(getUrlPaginationParams(DEFAULT_LIMIT))
  const [total, setTotal] = useState(0)
  const [programs, setPrograms] = useState([])
  const programsRef = useRef()

  const isMounted = useRef(false)

  const fetchPrograms = useCallback(async () => {
    setProgramsLoading(true)
    const query = {
      rid: radioId,
      ...params,
      ...getUrlParameters()
    }
    try {
      const res = await requestPrograms(query)
      if (isMounted.current) {
        setParams(query)
        setPrograms(res?.programs || [])
        setTotal(res?.count || 0)
      }
    } catch (e) {
      console.log(e)
    } finally {
      if (isMounted.current) {
        setProgramsLoading(false)
      }
    }
  }, [radioId, params])

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await requestDetail({ rid: radioId })
      if (isMounted.current) {
        setDetail(res?.data)
      }
    }

    fetchDetail()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radioId])

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    fetchPrograms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handlePageChange = useCallback(
    (page) => {
      const urlParams = getUrlParameters()
      const { limit } = getUrlPaginationParams(DEFAULT_LIMIT)
      const offset = (page - 1) * limit
      const url = `${pathname}${stringify(
        {
          ...urlParams,
          limit,
          offset
        },
        { addQueryPrefix: true }
      )}`
      navigate(url)
    },
    [navigate, pathname]
  )

  const handleSort = useCallback(
    (asc) => {
      const urlParams = getUrlParameters()
      const url = `${pathname}${stringify(
        {
          ...urlParams,
          offset: 0,
          asc
        },
        { addQueryPrefix: true }
      )}`
      navigate(url)
    },
    [navigate, pathname]
  )

  const renderItems = useMemo(() => {
    if (Array.isArray(programs)) {
      return (
        <ul ref={programsRef}>
          {programs.map((item, index) => {
            const {
              id,
              serialNum,
              name,
              listenerCount,
              likedCount,
              scheduledPublishTime,
              duration
            } = item

            return (
              <li
                key={id}
                className={`${styles.program} ${index % 2 ? styles.odd : ''}`}
              >
                <div className={styles.order}>
                  <span className={styles.num}>{serialNum}</span>
                  <SinglePlay
                    id={id}
                    type={PLAY_TYPE.PROGRAM.TYPE}
                    active={currentSong?.program?.id === id}
                  />
                </div>
                <div className={styles['name-box']} title={name}>
                  <Link to={`/program/${id}`} className={styles.name}>
                    {name}
                  </Link>
                  <div className={styles.actions}>
                    <Add id={id} type={PLAY_TYPE.PROGRAM.TYPE}>
                      <a href={null} className={`${styles.icon} ${styles.add}`}>
                        {ACTION_TYPES.add}
                      </a>
                    </Add>
                    <a href={null} className={`${styles.icon} ${styles.share}`}>
                      {ACTION_TYPES.share}
                    </a>
                    <a
                      href={null}
                      className={`${styles.icon} ${styles.download}`}
                    >
                      {ACTION_TYPES.download}
                    </a>
                  </div>
                </div>
                <div className={styles['listener-count']}>
                  播放{formatNumber(listenerCount)}
                </div>
                <div className={styles['liked-count']}>赞{likedCount}</div>
                <div className={styles['time']}>
                  {dayjs(scheduledPublishTime).format('YYYY-MM-DD')}
                </div>
                <div className={styles.duration}>
                  {formatDuration(duration)}
                </div>
              </li>
            )
          })}
        </ul>
      )
    }
  }, [programs, currentSong])

  const current = useMemo(() => params.offset / params.limit + 1, [params])

  const asc = useMemo(
    () => (params.asc ? JSON.parse(params.asc) : false),
    [params.asc]
  )

  return (
    <Page>
      <div className="main">
        <div className="left-wrapper">
          <div className="left">
            <div className={styles['head-box']}>
              <div className={styles['cover-box']}>
                <img
                  src={getThumbnail(detail?.picUrl, 200)}
                  alt="封面"
                  className={styles.cover}
                />
              </div>
              <div className={styles.info}>
                <h2 className={styles.title}>
                  <span className={styles.label} />
                  {detail?.name}
                </h2>
                <div className={styles.creator}>
                  <img
                    src={detail?.dj?.avatarUrl}
                    alt=""
                    className={styles.avatar}
                  />
                  <Link
                    to={`/user/home/${detail?.dj?.userId}`}
                    className={styles.nickname}
                  >
                    {detail?.dj?.nickname}
                  </Link>
                </div>
                <div className={styles.operation}>
                  <a href={null} className={styles['btn-subscribe']}>
                    订阅
                    {detail?.subCount
                      ? `(${formatNumber(detail.subCount)})`
                      : ''}
                  </a>
                  <Play type={PLAY_TYPE.RADIO.TYPE} id={detail?.id}>
                    <a href={null} className={styles['btn-play']}>
                      <PlayCircleOutlineIcon className={styles['play-icon']} />
                      <span>播放全部</span>
                    </a>
                  </Play>
                  <a href={null} className={styles['btn-share']}>
                    分享
                    {detail?.shareCount
                      ? `(${formatNumber(detail.shareCount)})`
                      : ''}
                  </a>
                </div>
                {detail?.desc ? (
                  <>
                    {detail?.category ? (
                      <Link
                        to={`/discover/radio/category/${detail?.categoryId}`}
                        className={styles.category}
                      >
                        {detail.category}
                      </Link>
                    ) : null}
                    <span className={styles.desc}>
                      <Collapse content={detail.desc} maxWordNumber={140} />
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className={styles['programs-wrapper']}>
              <div className={styles.subtitle}>
                <h3>节目列表</h3>
                <span className={styles.total}>共{detail?.programCount}期</span>
                <span className={styles.other}>
                  <span className={styles.sorter}>
                    <span
                      className={`${styles.desc} ${asc ? '' : styles.selected}`}
                      title="降序"
                      onClick={() => handleSort(false)}
                    />
                    <span
                      className={`${styles.asc} ${asc ? styles.selected : ''}`}
                      title="升序"
                      onClick={() => handleSort(true)}
                    />
                  </span>
                </span>
              </div>
              <>
                <ListLoading loading={programsLoading} />
                {!programsLoading ? (
                  programs.length ? (
                    renderItems
                  ) : (
                    <Empty />
                  )
                ) : (
                  ''
                )}
                <Pagination
                  current={current}
                  total={total}
                  pageSize={Number(params.limit)}
                  onChange={handlePageChange}
                  el={programsRef.current}
                />
              </>
            </div>
          </div>
        </div>
        <div className="right-wrapper">
          <ClientDownload />
        </div>
      </div>
    </Page>
  )
}

export default withRouter(RadioDetail)
