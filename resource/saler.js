// import HttpServe from '../lib/httpServe/index'

// export default {
//   saler: new HttpServe({
//     url: "api/v1/saler"
//   }),
// }
import httpServe from '../lib/httpServe/httpServe'
//成为销售
export function beSaler(data) {
  return httpServe({
    url: 'api/v1/salers',
    method: 'PUT',
    data: data
  })
}

//团队收益
export function teamEarnings() {
  return httpServe({
    url:'api/v1/salers/profit',
    method:'GET'
  })
}

//拉取我的团队
export function myTeam() {
  return httpServe({
    url:'api/v1/salers/team',
    method:'GET'
  })
}

//获取我的收益

export function myEarnings(data) {
  let date = data ? `?date=${data}` : ''
  return httpServe({
    url:`api/v1/income/me${date}`,
    method:'GET'
  })
}
export function getIncomeList(data) {
  let date = data ? `?date=${data}` : ''
  return httpServe({
    url:`api/v1/income/me/detail${date}`,
    method:'GET'
  })
}

//获取销售信息
export function getSalerInfo(id) {
  return httpServe({
    url:`api/v1/salers/${id}`,
    method:'GET',
    Authorization: false
  })
}

// 更改销售信息
export function updateSalerInfo(data) {
  return httpServe({
    url:'api/v1/salers/info',
    method:'PUT',
    data:data || ''
  })
}
//拉取绑定名片的文章

export function getBindArticle() {
  return httpServe({
    url:'api/v1/salers/card',
    method:'GET'
  })
}
//查询银行名字
export function getBankName(number) {
  return httpServe({
    url:`api/v1/utils/bank/${number}`,
    method:'GET'
  })
}