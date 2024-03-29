import { stringify } from 'qs'
import request from 'utils/request'
import API from 'api/toplist'

export async function requestRankList(params) {
  return request(
    `${API.rankList.url}${stringify(params, { addQueryPrefix: true })}`
  )
}

export async function requestAllTopList() {
  return request(API.all.url)
}
