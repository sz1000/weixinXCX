import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import {
  $Message
} from "../../../dist/base/index";
import {
  addFollow
} from "../../../resource/orderFollow.js";

var app = getApp();

Page({
  data: {
    consumeName: '',
    contact: ''
  },
  getValue: function (e) {
    let key = e.currentTarget.dataset.name
    let value = e.detail.value
    switch (key) {
      case 'consumeName':
        this.setData({
          consumeName: value
        })
        break;
      case 'contact':
        this.setData({
          contact: value
        })
      default:
        break;
    }
    console.log(this.data.contact)
  },
  submitInfo: async function () {
    var that = this
    let validate = {
      consumeName: that.data.consumeName,
      contact: that.data.contact
    }
    let {
      entries
    } = Object
    var i = 0
    for (let [key, value] of entries(validate)) {
      let cast
      switch (key) {
        case 'consumeName':
          if (value == '') {
            cast = '请输入用户姓名'
            break;
          }
        case 'contact':
          if (value == '') {
            cast = '请输入联系方式'
            break;
          }
      }
      if (cast) {
        $Message({
          content: cast,
          type: 'error'
        })
        cast = ''
        break;
      } else {
        i += 1
        if (i == 2) {
          that.requireSetData()
          i = 0
        }
      }
    }

  },
  requireSetData: async function () {
    var that = this 
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    await addFollow({
      orgId:1,
      consumer:that.data.consumeName,
      tel:that.data.contact
    }).then(res => {
      wx.hideLoading(),
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration:1500
      })
      wx.redirectTo({
        url:'/pages/myFollowOrder/Index/index?key='+'myTeam'
      })
    })
  },
  onLoad: function (options) {

  }
})