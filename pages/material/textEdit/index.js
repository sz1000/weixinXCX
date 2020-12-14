import callback from '../../../lib/callback.js'

Page({
  data: {
    text: '',
    type: '',
    id: '',
    callbackId: null,
    num: 0,
  },
  onLoad: function (option) {
    console.log(option)
    var type = option.type;
    this.data.callbackId = option.callback
    var contentText = decodeURIComponent(option.contentText)
    this.setData({
      text: contentText == '请输入图片简介' || contentText == '请输入本文信息' ? "" : contentText
    })
  },
  back: function (event) {
    console.log(event)
    var type = this.data.type
    var contentText = event.detail.value
    var id = this.data.id
    var num = this.data.num
    let textData = {
      text: event.detail.value,
      num: this.data.num
    }
    callback.get(this.data.callbackId)(textData)
    wx.navigateBack({
      delta: 1
    })
  },
  num: function (e) {
    this.setData({
      num: e.detail.cursor
    })
  }

})