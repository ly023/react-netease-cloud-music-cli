import { Component } from 'react'
import { connect } from 'react-redux'
import { requestLoginStatus } from 'services/user'
import { setUserInfo } from 'actions/user'
import { getCsrfToken } from 'utils'
import withRouter from 'hoc/withRouter'

const authDecorator = () => {
  return (WrappedComponent) => {
    @withRouter
    @connect()
    class AuthEnhance extends Component {
      static displayName = 'authEnhance'

      constructor(props) {
        super(props)
        this.state = {
          loading: false
        }
      }

      componentDidMount() {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
          this.setState({ loading: true })
          requestLoginStatus()
            .then((res) => {
              const data = res?.data
              this.props.dispatch(setUserInfo(data))
            })
            .finally(() => {
              this.setState({ loading: false })
            })
        }
      }

      render() {
        return this.state.loading ? null : <WrappedComponent {...this.props} />
      }
    }

    return AuthEnhance
  }
}

export default authDecorator
