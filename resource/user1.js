import httpServe from '../lib/httpServe/httpServe'
import {putlinke} from './card'

//登录
export function wechatLogin(data) {
  return httpServe({
    url: 'api/v1/auth/wechatLogin',
    method: 'POST',
    data: data,
    Authorization: false
  })
}
//上传本地点赞
export function uploadLocalLike() {
  let cardArr = wx.getStorageSync('cardArr')
	console.log("TCL: uploadLocalLike -> cardArr", cardArr)
  if(cardArr !== '' && cardArr.length !== 0){
    console.log("-==-=-=-=-=-=-=")
    cardArr.forEach((element)=>{
      putlinke(element).then((err)=>{
        console.log("成功")
      }).catch((error)=>{
				console.log("TCL: uploadLocalLike -> error", error)
      })
    })
  }
	console.log("TCL: uploadLocalLike -> cardArr", cardArr.length)
}
//注册
export function regist(data) {
  return httpServe({
    url: 'api/v1/auth/regist',
    method: 'PUT',
    data: data,
    Authorization: false
  })
}

//获取验证码
export function getCode(data) {
  return httpServe({
    url: 'api/v1/auth/code',
    method: 'POST',
    data: data,
    Authorization: false
  })
}
//修改用户信息
export function changeInfo(data) {
  return httpServe({
    url:'api/v1/user',
    method:'PUT',
    data
  })
}
//获取用户信息
export function  getUserInfo() {
  return httpServe({
    url:'api/v1/user',
    method:'GET',
    // Authorization: false
  })
}

//清除用户信息测试用
export function clear() {
  return httpServe({
    url:'api/clear',
    method:'GET'
  })
}
//成为vip
export function postVipOrder(data) {
  return httpServe({
    url:'/api/v1/salers/order',
    data,
    method:'POST'
  })
}

export function getVipPrice() {
  return httpServe({
    url:'api/v1/income/rate',
    method:'get',
    Authorization: false
  })
}

//添加收货地址
export function postUserAddress(data) {
  return httpServe({
    url:'api/v1/address',
    method:'post',
    Authorization: true,
    data
  })
}
//收货地址列表
export function getUserAddressList() {
  return httpServe({
    url:'api/v1/address',
    method:'get',
    Authorization: true,
  })
}

//删除
export function deleteUserAddress(id) {
  return httpServe({
    url:'api/v1/address/'+id,
    method:'DELETE',
    Authorization: true,
  })
}
//修改收货地址
export function putUserAddress(id,data) {
  return httpServe({
    url:'api/v1/address/'+id,
    method:'put',
    Authorization: true,
    data
  })
}
//获取收货地址
export function getUserAddress(id) {
  return httpServe({
    url:'api/v1/address/'+id,
    method:'get',
    Authorization: true
  })
}