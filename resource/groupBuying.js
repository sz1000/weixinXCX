import httpServe from "../lib/httpServe/httpServe"

//团购商品列表
export function getBuyingList(data) {
  return httpServe({
    url:`api/v1/group/?status=1`,
    method:'GET',
    Authorization: false
  })
}

//团购商品记录
export function getBuyingView(productId) {
  return httpServe({
    url:`api/v1/group/${productId}/view`,
    method:'POST'
  })
}

//团购商品记录
export function getBuyingGroups(productId,params) {
  return httpServe({
    url:`api/v1/group/groups/${productId}?${params ? '&prev_id='+params :''}`,
    method:'get',
    Authorization: false
  })
}

//获取团购信息
export function getBuyingGroupsInfo(groupId) {
  let auth =  wx.getStorageSync("token") ? true : false
  return httpServe({
    url:`api/v1/group/group/${groupId}`,
    method:'get',
    Authorization: auth
  })
}

//开团
export function getBuyingGroupsOpen(actId) {
  return httpServe({
    url:`api/v1/order/group`,
    method:'post',
    data:{
      act_id:actId
    }
  })
}

//参团
export function postBuyingGroupsJoin(groupid,actId) {
  return httpServe({
    url:`api/v1/order/group/${groupid}`,
    method:'post',
    data:{
      act_id:actId
    }
  })
}

//用订单id获取团信息
export function getOrderIdtoGroupInfo(orderId) {
  return httpServe({
    url:`api/v1/group/order/${orderId}`,
    method:'get'
  })
}