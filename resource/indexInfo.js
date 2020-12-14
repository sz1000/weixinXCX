import httpServe from "../lib/httpServe/httpServe"

//获取首页配置
export function getIndexInfo() {
  return httpServe({
    url:'api/v1/index',
    method:'GET',
    Authorization: false
  })
}

//获取门店简介配置
export function getShopIntro() {
  return httpServe({
    url:'api/v1/intro',
    method:'GET',
    Authorization: false
  })
}