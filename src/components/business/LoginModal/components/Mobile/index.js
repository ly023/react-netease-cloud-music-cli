import {Component} from 'react'
import PropTypes from 'prop-types'
import {createForm, formShape} from 'rc-form'
import FormItem from 'components/FormItem'
import KEY from 'constants/keyboardEventKey'
import {isValidMobileNumber} from 'utils'
import {requestCountryCodeList} from 'services/constants'

import styles from '../../index.scss'

function parseCountryCodeList(data) {
    if (Array.isArray(data)) {
        let countries = []
        data.forEach((item) => {
            countries = countries.concat(item.countryList)
        })
        return countries
    }
    return []
}

@createForm()
export default class Mobile extends Component {
    static propTypes = {
        form: formShape,
        onLogin: PropTypes.func,
        afterLogin: PropTypes.func,
    }

    constructor(props) {
        super(props)
        this.state = {
            countries: [],
            countryCode: 0,
            areaCodeSelectVisible: false,
            responseError: ''
        }
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchCountryCodeList()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchCountryCodeList = async () => {
        const res = await requestCountryCodeList()
        if (this._isMounted) {
            const countryCodeList = parseCountryCodeList(res.data)
            this.setState({
                countries: countryCodeList,
                countryCode: countryCodeList[0]?.code,
            })
        }
    }

    setAreaCodeSelectVisible = (visible) => {
        this.setState({
            areaCodeSelectVisible: visible
        })
    }

    handleChangeCountryCode = (index) => {
        this.setState({
            areaCodeSelectVisible: false,
            countryCode: this.state.countries[index].code,
        })
    }

    validatePhone = (rule, value, callback) => {
        if (!value) {
            callback('请输入手机号')
            return
        }
        if (!isValidMobileNumber(value)) {
            callback('请输入正确的手机号')
            return
        }
        callback()
    }

    getErrorMessage = () => {
        const fieldsError = this.props.form.getFieldsError()
        const validError = Object.values(fieldsError).filter(v => !!v)
        return validError?.[0]
    }

    handleEnterKey = (e) => {
        if (e.key === KEY.ENTER) {
            this.handleSubmit()
        }
    }

    setAuthCooKie = (cookieStr) => {
        if(typeof cookieStr === 'string') {
            const cookies = cookieStr.split(';;')
            let csrfCookie = cookies.find(s => s.startsWith('__csrf'))
            if(csrfCookie) {
                csrfCookie = csrfCookie.replace('__csrf', 'CSRF')
               document.cookie = csrfCookie
            }
        }
    }

    handleSubmit = () => {
        const {form, onLogin, afterLogin} = this.props
        form.validateFields({first: true}, (errors, values) => {

            if (!errors) {
                this.setState({responseError: ''})

                const payload = {
                    body: {
                        ...values,
                        countrycode: this.state.countryCode
                    }
                }

                this.setState({loading: true})

                onLogin && onLogin(payload,
                    (res) => {
                        this.setAuthCooKie(res?.cookie)
                        this.setState({loading: false})
                        afterLogin && afterLogin()
                    },
                    (error) => {
                        this.setState({loading: false})
                        this.setState({
                            responseError: error?.responseJson?.message
                        })
                    })
            }
        })
    }

    render() {
        const {getFieldDecorator, getFieldError} = this.props.form
        const {countries, countryCode, areaCodeSelectVisible, responseError, loading} = this.state

        const errorMessage = this.getErrorMessage()

        return (
            <div styleName="login-mobile">
                <FormItem classname={styles["login-phone-wrapper"]} error={getFieldError('phone')}>
                    <span styleName="login-code-current"
                          onClick={() => this.setAreaCodeSelectVisible(!areaCodeSelectVisible)}>
                        <span>+{countryCode}</span>
                        <span styleName="login-icon login-arrow"/>
                    </span>
                    <div styleName="login-input-wrapper">
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [
                                    {
                                        validator: this.validatePhone
                                    },
                                ],
                                validateTrigger: false
                            })(
                                <input
                                    autoComplete="off"
                                    type="number"
                                    placeholder="请输入手机号"
                                    styleName="login-input login-phone-number"
                                    onKeyPress={this.handleEnterKey}
                                />
                            )
                        }
                    </div>
                    {/*国家区号列表*/}
                    <ul styleName="login-code-options" className={areaCodeSelectVisible ? null : 'hide'}>
                        {
                            countries.map((item, index) => {
                                const {en, zh, code} = item
                                return <li key={en} className="clearfix" styleName="login-code-item"
                                           onClick={() => this.handleChangeCountryCode(index)}>
                                    <span className="fl">{zh}</span>
                                    <span className="fr">+{code}</span>
                                </li>
                            })
                        }
                    </ul>
                </FormItem>
                <FormItem classname="mt-10" error={getFieldError('password')}>
                    {
                        getFieldDecorator('password', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码'
                                },
                            ],
                            validateTrigger: false
                        })(
                            <input
                                autoComplete="off"
                                type="password"
                                styleName="login-input"
                                placeholder="请输入密码"
                                onKeyPress={this.handleEnterKey}
                            />
                        )
                    }
                </FormItem>
                <div styleName="error-msg login-error" className={errorMessage || responseError ? null : 'hide'}>
                    <i styleName="login-icon"/><span>{errorMessage || responseError}</span>
                </div>
                <div styleName="login-option">
                    <label>
                        {
                            getFieldDecorator('rememberLogin', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <input type="checkbox"/>
                            )
                        }
                        自动登录
                    </label>
                    <a href={null} className="fr" styleName="login-option-link">忘记密码？</a>
                </div>
                <a
                    href={null}
                    hidefocus="true"
                    styleName="login-btn"
                    onClick={this.handleSubmit}
                ><i>{loading ? '登录中...' : '登录'}</i></a>
            </div>
        )
    }
}