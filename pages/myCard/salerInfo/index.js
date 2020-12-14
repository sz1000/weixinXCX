import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  changeInfo,
  getUserInfo
} from '../../../resource/user1.js'
import qiniuServe from '../../../lib/httpServe/serveQiniu.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputStyle: '',
    avatarUrl: '',
    name: '',
    nickName:'',
    telephone: '',
    gender: '',
    userMs: '',
    showBackBtn: '',
    showSaveBtn: false
  },
  //选择头像
  chooseAvatar: async function () {

    let uploaded = await qiniuServe.uploaderImg({
      count: 1,
      sizeType: '',
      sourceType: ''
    }).catch((e) => {
      console.log(e)
      return
    })
    if (uploaded) {
      // wx.showLoading({
      //   title: '上传中...',
      //   mask: true
      // })
      let res = await changeInfo({
        avatar: uploaded
      })
      console.log(res)
      // wx.hideLoading()
      if (res.data.msg == 'success') {
        wx.showToast({
          title: '头像更换成功',
          icon: 'success'
        })
      }
      console.log(uploaded)
      this.setData({
        avatarUrl: uploaded
      })
    }
  },
  //更改手机号码后刷新手机数据
  freshData: async function (params) {
    console.log("TCL: params", params)
    let res = await getUserInfo()
    this.setData({
      telephone: res.data.data.tel
    })
  },
  showTelBox: function () {
    this.setData({
      showRegisterBox: true,
    })
  },
  input: function (e) {
    console.log(e)
    let value = e.currentTarget.dataset.index
  },
  change: function (e) {
    console.log(e)
    var that = this;
    let beforeValue = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.type
    let afterValue = e.detail.value
    console.log(afterValue)
    switch (item) {
      case 'name':
        that.setData({
            name: afterValue
          },
          function () {
            if (afterValue != beforeValue) {
              that.setData({
                showSaveBtn: true
              })
            } else {
              that.setData({
                showSaveBtn: false
              })
            }
          })
        break;
      case 'gender':
        that.setData({
          gender: afterValue
        }, function () {
          if (afterValue != beforeValue) {
            that.setData({
              showSaveBtn: true
            })
          } else {
            that.setData({
              showSaveBtn: false
            })
          }
        })
        break;
     
      default:
        break;
    }
  },
  saveBtn: async function () {
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    let changeData = await changeInfo({
      name: this.data.name,
      gender: this.data.gender == '男' ? 1 : 2,
      avatar: this.data.avatarUrl
    })
    wx.hideLoading()
    this.setData({
      showSaveBtn: false
    })
    console.log(changeData)
    // if(changeData.data.msg == 'success'){
    //   console.log('获取用户信息')
    //   let userInfoAfter =await getUserInfo()
    //   console.log(userInfoAfter)
    // }

  },
  onLoad: async function () {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    let userInfo = await getUserInfo()
   
    let item = userInfo.data.data
    var sex = ''
    if (item.gender == 1) {
      sex = '男'
    } else if (item.gender == 2) {
      sex = '女'
    } else {
      sex = '未知'
    }
    this.setData({
      name: item.name,
      avatarUrl: item.avatar,
      telephone: item.tel,
      birthTime: item.created_at,
      gender: sex,
      nickName:item.nick_name
    })

  },
  onUnload: async function () {
    console.log('页面写在成功')
    let res = await getUserInfo()
    let item = res.data.data
    wx.setStorage({
      key: 'loginData',
      data: item
    })
  },
 //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
}
})