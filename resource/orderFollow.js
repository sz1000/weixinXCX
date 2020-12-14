import httpServe from "../lib/httpServe/httpServe.js";

//添加跟单
export function addFollow(data) {
  return httpServe({
    url:'api/v1/follow',
    method:'POST',
    data
  })
}


//获取跟单
export function  getFollow(data) {
  return httpServe({
    url:'api/v1/follow',
    method:'GET',
    data
  })
}
//获取跟单详情
export function getDetailFollow(id) {
  return httpServe({
    url:`api/v1/follow/${id}`,
    method:'GET'
  })
}