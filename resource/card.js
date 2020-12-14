import httpServe from "../lib/httpServe/httpServe"

//获取销售名片的接口
export function getCardInfo(id,auto) {
  return httpServe({
    url:`api/v1/salers/card/${id}`,
    method:'GET',
    Authorization: auto || false
  })
}
//更新名片信息的接口
export function putCardInfo(cardId,data) {
  return httpServe({
    url:`api/v1/salers/card/${cardId}`,
    method:'PUT',
    data
  })
}
//用户点赞接口的接口
export function putlinke(cardId) {
  return httpServe({
    url:`api/v1/salers/like/${cardId}`,
    method:'PUT'
  })
}
//取消点赞的接口
export function putlinkeCancel(cardId) {
  return httpServe({
    url:`api/v1/salers/like/cancel/${cardId}`,
    method:'PUT'
  })
}
//记录用户浏览的接口
export function postPv(cardId,auth) {
  return httpServe({
    url:`api/v1/salers/card/pv/${cardId}`,
    method:'POST',
    Authorization: auth || false
  })
}
