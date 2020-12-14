

Page({
  data:{
    userInfo:'',//用户缓存信息
    id:'',
    title:'',
    imgUrl:''
  },   
  //返回首页
  backIndex:function () {
    wx.reLaunch({
      url:'/pages/main/vipDetails/index'
    })
  },
  onLoad: function (option) {
  }
})