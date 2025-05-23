import { Component } from 'react'
import PropTypes from 'prop-types'
import withRouter from 'hoc/withRouter'
import { connect } from 'react-redux'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import Modal from 'components/Modal'
import { LOGIN_MODE } from 'constants/login'
import Guide from './components/Guide'
import Code from './components/Code'
import Mobile from './components/Mobile'

import styles from './index.scss'

@withRouter
@connect()
class LoginModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    mode: PropTypes.oneOf(Object.keys(LOGIN_MODE)),
    onCancel: PropTypes.func
  }

  static defaultProps = {
    visible: false,
    mode: LOGIN_MODE.MOBILE.TYPE
  }

  constructor(props) {
    super(props)
    this.state = {
      mode: props.mode
    }
  }

  changeMode = (mode) => {
    this.setState({ mode })
  }

  afterLogin = () => {
    this.props.onCancel?.()
    this.props.navigate(0)
  }

  getRenderMode = (mode) => {
    switch (mode) {
      case LOGIN_MODE.GUIDE.TYPE:
        return <Guide {...this.props} changeMode={this.changeMode} />
      case LOGIN_MODE.CODE.TYPE:
        return (
          <Code
            {...this.props}
            changeMode={this.changeMode}
            afterLogin={this.afterLogin}
          />
        )
      case LOGIN_MODE.MOBILE.TYPE:
        return <Mobile {...this.props} afterLogin={this.afterLogin} />
      default:
    }
  }

  getRenderModeTip = (mode) => {
    switch (mode) {
      case LOGIN_MODE.MOBILE.TYPE:
        return (
          <div className={styles['login-mode']}>
            <a
              href={null}
              className={styles['login-link-primary']}
              onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}
            >
              &lt;&nbsp;&nbsp;其他登录方式
            </a>
            <a
              href={null}
              className={`fr ${styles['sign-up-guide']}`}
              onClick={() => this.changeMode(LOGIN_MODE.SIGN_UP.TYPE)}
            >
              没有帐号？免费注册&nbsp;&nbsp;
            </a>
          </div>
        )
      case LOGIN_MODE.SIGN_UP.TYPE:
      case LOGIN_MODE.RESET_PASSWORD.TYPE:
        return (
          <div className={styles['login-mode']}>
            <a
              href={null}
              className={styles['login-link-primary']}
              onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}
            >
              &lt;&nbsp;&nbsp;返回登录
            </a>
          </div>
        )
      case LOGIN_MODE.EMAIL163.TYPE:
        return (
          <div className={styles['login-mode']}>
            <a
              href={null}
              className={styles['login-link-primary']}
              onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}
            >
              &lt;&nbsp;&nbsp;其他登录方式
            </a>
          </div>
        )
      default:
    }
  }

  getTitle = (mode) => {
    return LOGIN_MODE[mode] && LOGIN_MODE[mode].TITLE
  }

  render() {
    const { mode } = this.state

    return (
      <Modal {...this.props} title={this.getTitle(mode)}>
        <div className={styles.cont}>
          {this.getRenderMode(mode)}
          {/*{this.getRenderModeTip(mode)}*/}
          {/*{mode === LOGIN_MODE.GUIDE.TYPE ? (*/}
          {/*  <div className={styles['scan-guide']} title="扫码登录">*/}
          {/*    <QrCodeScannerIcon*/}
          {/*      className={styles['scan-guide-icon']}*/}
          {/*      onClick={() => this.changeMode(LOGIN_MODE.CODE.TYPE)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*) : null}*/}
        </div>
      </Modal>
    )
  }
}

export default LoginModal

// function mapStateToProps(state) {
//     return {user: state.user}
// }
//
// export default connect(mapStateToProps)(LoginPopover)
