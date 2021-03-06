import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/radio'

// 电台分类
export async function requestCategories() {
    return request(API.categories.url)
}

// 电台节目榜
export async function requestProgramRank(params) {
    return request(`${API.programRank.url}?${stringify(params)}`)
}

// 电台分类推荐
export async function requestCategoryRecommendation(params) {
    return request(`${API.categoryRecommendation.url}?${stringify(params)}`)
}

// 类别热门电台
export async function requestCategoryHot(params) {
    return request(`${API.categoryHot.url}?${stringify(params)}`)
}

// 电台节目详情
export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}

// 首页热门主播mock
export async function requestHotAnchorMock() {
    return request(API.hotAnchorMock.url, null, {errorShow: false})
}
