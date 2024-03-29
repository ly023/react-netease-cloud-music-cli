/**
 * 歌曲、歌单、专辑、mv...评论
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash-es'
import toast, { Toaster } from 'react-hot-toast'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import pubsub from 'utils/pubsub'
import { setUserCommentInfo } from 'actions/user'
import { DEFAULT_AVATAR, PAGINATION_LIMIT } from 'constants'
import ListLoading from 'components/ListLoading'
import Pagination from 'components/Pagination'
import Confirm from 'components/Confirm'
import { requestFollows } from 'services/user'
import {
  requestMusicComments,
  requestPlaylistComments,
  requestAlbumComments,
  requestMVComments,
  requestVideoComments,
  comment,
  like
} from 'services/comment'
import {
  formatNumber,
  formatTimestamp,
  generateGuid,
  getThumbnail,
  scrollIntoView
} from 'utils'
import Editor from './components/Editor'
import { msgToHtml } from './components/Editor/utils'
import ReplyEditor from './components/ReplyEditor'

import styles from './index.scss'

const COMMENT_TYPES = {
  MUSIC: {
    TYPE: 0,
    REQUEST: requestMusicComments
  },
  PLAYLIST: {
    TYPE: 2,
    REQUEST: requestPlaylistComments
  },
  ALBUM: {
    TYPE: 3,
    REQUEST: requestAlbumComments
  },
  MV: {
    TYPE: 1,
    REQUEST: requestMVComments
  },
  VIDEO: {
    TYPE: 5,
    REQUEST: requestVideoComments
  }
}

const ACTION_TYPES = {
  DELETE: 0, // 删除
  CREATE: 1, // 发送
  REPLAY: 2 // 回复
}

@connect(({ base, user }) => ({
  navHeight: base.navHeight,
  isLogin: user.isLogin,
  userInfo: user.userInfo,
  activeCommentId: user.activeCommentId
}))
export default class Comments extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.keys(COMMENT_TYPES)),
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onRef: PropTypes.func
  }

  static defaultProps = {
    type: Object.keys(COMMENT_TYPES)[0],
    onRef() {}
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    this.domIdPrefix = generateGuid()
  }

  getInitialState = () => {
    return {
      follows: [], // 关注的人
      topComments: [], // 置顶评论
      hotComments: [], // 热门评论
      comments: [], // 评论
      total: 0, // 总数
      current: 1, // 当前页码
      offset: 0, // 偏移量,
      replyVisible: false,
      activeCommentId: 0,
      confirmVisible: false,
      commentsLoading: false,
      commentLoading: false,
      deleteLoading: false,
      likeLoading: false,
      replayLoading: false
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.props.onRef(this)
    this.requestFunc = COMMENT_TYPES[this.props.type].REQUEST
    if (!this.props.id || Number.isNaN(this.props.id)) {
      return
    }
    this.fetchFollows()
    this.fetchComments()
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props
    if (!Number.isNaN(id) && id !== prevProps.id) {
      this.setState(this.getInitialState())
      this.fetchComments()
    }
    if (this.props.isLogin && !prevProps.isLogin) {
      this.fetchFollows()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchFollows = async () => {
    const {
      userInfo: { userId }
    } = this.props
    if (userId) {
      const res = await requestFollows({ uid: userId })
      if (this._isMounted && res) {
        const follows = res.follow || []
        this.setState({
          follows: follows
        })
      }
    }
  }

  fetchComments = (offset = 0) => {
    const params = {
      id: this.props.id,
      offset
    }
    this.setState({ commentsLoading: true })
    this.requestFunc(params)
      .then((res) => {
        if (this._isMounted) {
          const {
            topComments = [],
            hotComments = [],
            comments = [],
            total = 0
          } = res
          this.setState({
            offset,
            total,
            topComments,
            hotComments,
            comments
          })
          this.setTotalComment(total)
        }
      })
      .finally(() => {
        if (this._isMounted) {
          this.setState({ commentsLoading: false })
        }
      })
  }

  handlePageChange = (page) => {
    this.setState({
      current: page
    })
    this.fetchComments((page - 1) * PAGINATION_LIMIT)
  }

  validateLogin = () => {
    const { isLogin } = this.props
    if (isLogin) {
      return true
    }
    pubsub.publish('login')
    return false
  }

  setTotalComment = (total) => {
    const { setTotalComment } = this.props
    setTotalComment && setTotalComment(total)
  }

  setEditorRef = (ref) => {
    this.editorRef = ref
  }

  setReplyEditorRef = (ref) => {
    this.replyEditorRef = ref
  }

  focusEditor = () => {
    this.editorRef.focus()
    scrollIntoView(
      document.getElementById(`${this.domIdPrefix}-wrapper`),
      this.props.navHeight
    )
  }

  getCommentKey = (commentId) => {
    if (this.state.comments.find((v) => v.commentId === commentId)) {
      return 'comments'
    }
    if (this.state.hotComments.find((v) => v.commentId === commentId)) {
      return 'hotComments'
    } else {
      return 'topComments'
    }
  }

  getCommonBody = () => {
    const { id, type } = this.props
    return {
      id: id,
      type: COMMENT_TYPES[type].TYPE
    }
  }

  handleCreateComment = (content) => {
    const body = {
      ...this.getCommonBody(),
      t: ACTION_TYPES.CREATE,
      content: content
    }
    if (this.state.commentLoading) {
      return
    }
    this.setState({ commentLoading: true })
    comment(body)
      .then((res) => {
        if (this._isMounted) {
          this.setState(
            (prevState) => {
              return {
                total: prevState.total + 1,
                comments: [res.comment].concat(prevState.comments)
              }
            },
            () => {
              // 清空评论框
              this.editorRef.clear()
              // 定位到当前评论
              scrollIntoView(
                document.getElementById(
                  this.getItemDomId(res.comment.commentId)
                ),
                this.props.navHeight
              )
              // 弹窗提示
              toast.success('评论成功')
            }
          )
        }
      })
      .finally(() => {
        if (this._isMounted) {
          this.setState({ commentLoading: false })
        }
      })
  }

  handleShowDeleteConfirm = (commentId) => {
    this.setState({
      activeCommentId: commentId,
      confirmVisible: true
    })
  }

  handleCancelDeleteConfirm = () => {
    this.setState({ confirmVisible: false })
  }

  handleDeleteComment = () => {
    const commentId = this.state.activeCommentId
    const body = {
      ...this.getCommonBody(),
      t: ACTION_TYPES.DELETE,
      commentId: commentId
    }
    if (this.state.deleteLoading) {
      return
    }
    this.setState({ deleteLoading: true })
    comment(body)
      .then(() => {
        if (this._isMounted) {
          this.setState((prevState) => {
            const commentKey = this.getCommentKey(commentId)
            return {
              confirmVisible: false,
              [commentKey]: prevState[commentKey].filter(
                (v) => v.commentId !== commentId
              ),
              total:
                commentKey === 'comments'
                  ? prevState.total - 1
                  : prevState.total
            }
          })
          toast.success('删除成功')
        }
      })
      .finally(() => {
        if (this._isMounted) {
          this.setState({ deleteLoading: false })
        }
      })
  }

  handleLikeComment = (commentId, liked) => {
    if (this.validateLogin()) {
      const body = {
        ...this.getCommonBody(),
        cid: commentId,
        t: liked ? 0 : 1 // 1点赞 0取消点赞
      }
      if (this.state.likeLoading) {
        return
      }
      this.setState({ likeLoading: true })
      like(body)
        .then(() => {
          if (this._isMounted) {
            const commentKey = this.getCommentKey(commentId)
            const comments = cloneDeep(this.state[commentKey])
            const comment = comments.find((v) => v.commentId === commentId)
            comment.liked = !liked
            comment.likedCount = !liked
              ? comment.likedCount + 1
              : comment.likedCount - 1
            this.setState({
              [commentKey]: comments
            })
          }
        })
        .finally(() => {
          if (this._isMounted) {
            this.setState({ likeLoading: false })
          }
        })
    }
  }

  toggleReplyEditor = (commentId) => {
    if (this.validateLogin()) {
      let visible
      if (this.props.activeCommentId !== commentId) {
        this.props.dispatch(setUserCommentInfo({ activeCommentId: commentId }))
        visible = true
      } else {
        visible = !this.state.replyVisible
      }
      this.setState(
        {
          replyVisible: visible
        },
        () => {
          if (visible) {
            this.replyEditorRef.focus()
          }
        }
      )
    }
  }

  handleReplyComment = async (commentId, content) => {
    const body = {
      ...this.getCommonBody(),
      t: ACTION_TYPES.REPLAY,
      commentId: commentId,
      content: content
    }
    if (this.state.replyLoading) {
      return
    }
    this.setState({ replyLoading: true })
    comment(body)
      .then((res) => {
        if (this._isMounted) {
          this.setState(
            (prevState) => {
              return {
                replyVisible: false, // 关闭回复
                total: prevState.total + 1,
                comments: [res.comment].concat(prevState.comments)
              }
            },
            () => {
              // 定位到当前评论
              scrollIntoView(
                document.getElementById(
                  this.getItemDomId(res.comment.commentId)
                ),
                this.props.navHeight
              )
              this.props.dispatch(setUserCommentInfo({ activeCommentId: 0 }))
              toast.success('回复成功')
            }
          )
        }
      })
      .finally(() => {
        if (this._isMounted) {
          this.setState({ replyLoading: false })
        }
      })
  }

  isAuthor = (userId) => {
    return userId === this.props.userInfo?.userId
  }

  getRenderVip = (item = {}) => {
    // todo 不完全正确
    const { userType = 0, vipRights = {} } = item?.user || {}
    const isAssociator = vipRights?.associator?.rights
    const hasMusicPackage = vipRights?.musicPackage?.rights
    let userSuffix
    let vipSuffix
    // 用户类型
    if (userType) {
      if (userType === 2 || userType === 10) {
        userSuffix = <span className={`${styles.icon} ${styles['v-icon`']}`} />
      } else if (userType === 4) {
        userSuffix = (
          <span className={`${styles.icon} ${styles['music-icon`']}`} />
        )
      } else if (userType === 201) {
        userSuffix = (
          <span className={`${styles.icon} ${styles['star-icon`']}`} />
        )
      }
    }
    // 是会员
    if (isAssociator) {
      // 年会员
      if (vipRights.redVipAnnualCount === 1) {
        vipSuffix = (
          <span
            className={`${styles['vip-icon']} ${styles['vip-year-icon']}`}
          />
        )
      } else {
        vipSuffix = <span className={styles['vip-icon']} />
      }
    } else if (hasMusicPackage) {
      // 音乐包
      if (vipRights.musicPackage.vipCode === 220) {
        vipSuffix = <span className={styles['package-icon']} />
      }
    }
    return (
      <>
        {userSuffix}
        {vipSuffix}
      </>
    )
  }

  getRenderExpression = (item) => {
    return item?.expressionUrl ? (
      <div className={styles.expression}>
        <img src={getThumbnail(item.expressionUrl, 70)} alt="" />
      </div>
    ) : null
  }

  getRenderReplied = (item) => {
    const repliedComment = item?.beReplied?.[0]
    if (repliedComment) {
      let content
      if (repliedComment.content) {
        content = (
          <>
            <Link
              to={`/user/home/${repliedComment.user?.userId}`}
              className={styles.nickname}
            >
              {repliedComment.user?.nickname}
            </Link>
            {this.getRenderVip(repliedComment)}
            ：
            <span
              dangerouslySetInnerHTML={{
                __html: msgToHtml(repliedComment.content)
              }}
            />
            {this.getRenderExpression(repliedComment)}
          </>
        )
      } else {
        content = '该评论已删除'
      }
      return <div className={styles.replied}>{content}</div>
    }
    return null
  }

  getItemDomId = (commentId) => {
    return `${this.domIdPrefix}-${commentId}`
  }

  getRenderComments = (comments) => {
    if (Array.isArray(comments)) {
      const { activeCommentId } = this.props
      const { follows, replyVisible, replyLoading } = this.state
      return comments.map((item) => {
        return (
          <div
            key={item.commentId}
            id={this.getItemDomId(item.commentId)}
            className={styles.item}
          >
            <img
              className={styles['item-avatar']}
              src={getThumbnail(item?.user?.avatarUrl, 100)}
              alt="头像"
              onError={(e) => {
                e.target.scr = DEFAULT_AVATAR
              }}
            />
            <div className={styles.text}>
              <div className={styles.comment}>
                <Link
                  to={`/user/home/${item?.user?.userId}`}
                  className={styles.nickname}
                >
                  {item?.user?.nickname}
                </Link>
                {this.getRenderVip(item)}
                ：
                <span
                  dangerouslySetInnerHTML={{ __html: msgToHtml(item?.content) }}
                />
                {this.getRenderExpression(item)}
              </div>
              {this.getRenderReplied(item)}
              <div className={styles.feedback}>
                <span className={styles.time}>
                  {formatTimestamp(item?.time)}
                </span>
                <div>
                  {this.isAuthor(item?.user?.userId) ? (
                    <>
                      <span
                        className={styles.delete}
                        onClick={() =>
                          this.handleShowDeleteConfirm(item.commentId)
                        }
                      >
                        删除
                      </span>
                      <span className={styles.space}>|</span>
                    </>
                  ) : null}
                  <span
                    className={`${styles.like} ${item?.liked ? styles.liked : ''}`}
                    onClick={() =>
                      this.handleLikeComment(item.commentId, item?.liked)
                    }
                  >
                    <ThumbUpAltOutlinedIcon className={styles['like-icon']} />
                    {item?.likedCount
                      ? `(${formatNumber(item.likedCount, 1)})`
                      : null}
                  </span>
                  <span className={styles.space}>|</span>
                  <span
                    className={styles.reply}
                    onClick={() => this.toggleReplyEditor(item.commentId)}
                  >
                    回复
                  </span>
                </div>
              </div>
              {replyVisible && activeCommentId === item.commentId ? (
                <ReplyEditor
                  onRef={this.setReplyEditorRef}
                  follows={follows}
                  initialValue={`回复${item?.user?.nickname}:`}
                  onSubmit={this.handleReplyComment}
                  loading={replyLoading}
                />
              ) : null}
            </div>
          </div>
        )
      })
    }
    return null
  }

  render() {
    const { isLogin, userInfo } = this.props
    const {
      follows,
      topComments,
      hotComments,
      comments,
      total,
      current,
      offset,
      confirmVisible,
      commentsLoading,
      commentLoading
    } = this.state

    return (
      <>
        <div id={`${this.domIdPrefix}-wrapper`}>
          <div className={styles.title}>
            <h3>
              <span>评论</span>
            </h3>
            <span className={styles.count}>共{total}条评论</span>
          </div>
          <div className={styles.content}>
            <div className={styles['editor-wrapper']}>
              <img
                className={styles.avatar}
                src={isLogin ? userInfo?.avatarUrl : ''}
                alt="头像"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR
                }}
              />
              <div className={styles.editor}>
                <Editor
                  onRef={this.setEditorRef}
                  follows={follows}
                  onSubmit={this.handleCreateComment}
                  loading={commentLoading}
                />
              </div>
            </div>
            {commentsLoading ? (
              <ListLoading />
            ) : (
              <div>
                {topComments.length ? (
                  <div>
                    <h4 className={styles['sub-title']}>置顶评论</h4>
                    {this.getRenderComments(topComments)}
                  </div>
                ) : null}
                {hotComments.length ? (
                  <div className={styles['hot-comment']}>
                    {offset ? null : (
                      <h4 className={styles['sub-title']}>精彩评论</h4>
                    )}
                    {this.getRenderComments(hotComments)}
                  </div>
                ) : null}
                {comments.length ? (
                  <div>
                    {current === 1 ? (
                      <h4 className={styles['sub-title']}>最新评论({total})</h4>
                    ) : null}
                    {this.getRenderComments(comments)}
                    <div className={styles.pagination}>
                      <Pagination
                        total={total}
                        current={current}
                        onChange={this.handlePageChange}
                        el={document.getElementById(
                          `${this.domIdPrefix}-wrapper`
                        )}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <Confirm
          visible={confirmVisible}
          content="确定删除评论？"
          onCancel={this.handleCancelDeleteConfirm}
          onOk={this.handleDeleteComment}
        />
        <Toaster />
      </>
    )
  }
}
