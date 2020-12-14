import regeneratorRuntime, { async } from "../../../lib/httpServe/regeneration-runtime.js";
import { getOneArticle } from "../../../resource/material.js";

Page({
  data:{
    userInfo:'',//用户缓存信息
    id:'',
    title:'',
    imgUrl:''
  },
  //分享朋友圈
  shareToScope:function() {
    wx.navigateTo({
      url:'/pages/material/materialShareFriend/index?articleId='+this.data.id
    })
  },
  onShareAppMessage(res){
    var that =this
    let item = that.data.userInfo.salerInfo
    if(res.from == 'button'){
    }
  if(item != null){
    return{
      title:that.data.title,
      path:'/pages/main/h5Webview/index?id='+that.data.id+'&salerId='+item.id,
      imageUrl:that.data.imgUrl
    }
  }     
  },
  //返回首页
  backIndex:function () {
    wx.reLaunch({
      url:'/pages/main/homePage/index'
    })
  },
  onLoad: async function (option) {
    const userInfo = wx.getStorageSync('loginData') //获取用户信息缓存
    let res = await getOneArticle(option.articleId)
    let item = res.data.data
    this.setData({
      userInfo,
      id:item.id,
      title:item.title,
      imgUrl:item.head_img
    })
  }
})