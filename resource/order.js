import httpServe from '../lib/httpServe/httpServe.js';

//创建订单
export function createOrder(data) {
  return httpServe({
    url:'api/v1/order',
    method:'POST',
    data
  })
}

//支付订单接口
export function payOrder(id) {
  return httpServe({
    url:`api/v1/order/${id}/pay`,
    method:'POST',
  })
}
//删除订单
export function deleteOrder(id) {
  return httpServe({
    url:`api/v1/order/${id}`,
    method:'DELETE'
  })
}
//获取订单

export function  orderGet(data) {
  return httpServe({
    url:`api/v1/order`,
    method:'GET',
    data:data || ''
  })
}
//取消订单

export function orderCancel(id) {
  return httpServe({
    url:`api/v1/order/${id}/cancel`,
    method:'PUT',
  })
}

//添加订单消费
export function addPayOrder(data) {
  return httpServe({
    url:`api/v1/extraConsume`,
    method:'POST',
    data
  })
}

//获取订单详情
export function getDetailOrder(id) {
  return httpServe({
    url:`api/v1/order/${id}`,
    method:'GET'
  })
}


//获取订单数
export function getOrderCount(data) {
  return httpServe({
    url:`api/v1/order/count`,
    method:'GET',
    data
  })
}
//订单退款
export function orderRefund({id,cause}) {
  return httpServe({
    url:`api/v1/order/refund/${id}`,
    method:'PUT',
    data:{
      cause
    }
  })
}