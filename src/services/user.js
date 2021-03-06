import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/user'

export async function requestMobileLogin(body) {
    return request(API.mobileLogin.url, {
        method: API.mobileLogin.type,
        body: body
    })
}

export async function requestEmailLogin(body) {
    return request(API.emailLogin.url, {
        method: API.emailLogin.type,
        body: body
    })
}

export async function requestLogout() {
    return request(API.logout.url)
}

export async function requestLoginStatus() {
    return request(API.loginStatus.url)
}

export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}

export async function requestSubContent() {
    return request(API.subContent.url)
}

export async function requestDailySignIn(body) {
    return request(API.dailySignIn.url, {
        method: API.dailySignIn.type,
        body: body
    })
}

export async function requestPlaylist(params) {
    return request(`${API.playlist.url}?${stringify(params)}`)
}

export async function requestFollows(params) {
    return request(`${API.follows.url}?${stringify(params)}`)
}
