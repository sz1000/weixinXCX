// pages/main/userInfo/userAddress/addAddress/index.js
import {
  postUserAddress,
  putUserAddress,
  getUserAddress
} from '../../../../../resource/user1'

import {
  $Message
} from '../../../../../dist/base/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitData: {
      user_id: '',
      reciver: '',
      tel: '',
      status: '',
      address: "",
      detail_address: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      console.log(options.id)
      this.id = options.id
      this.initData()
    }
  },
  onShow: function () {

  },
  initData() {
    getUserAddress(this.id).then(res => {
      console.log("TCL: initData -> res", res)
      this.setData({
        submitData: res.data.data
      })
    }).catch(err => {
      console.log("TCL: initData -> err", err)
    })
  },
  bindRegionChange(e) {
    console.log("TCL: bindRegionChange -> e", e.detail.value)
    this.setData({
      ['submitData.address']: e.detail.value
    })
  },
  handleSubmit(e) {
    let submitData = e.detail.value
    console.log(submitData)
    submitData.address = this.data.submitData.address
    console.log("TCL: handleSubmit -> submitData", submitData)
    
    if (!submitData.reciver) {
      $Message({
        content: '请输入姓名',
        type: 'error'
      })
      return
    }
    if (!submitData.tel) {
      $Message({
        content: '请输入正确的联系电话',
        type: 'error'
      })
      return
    }
    if (!submitData.address) {
      $Message({
        content: '请选择所在省市区',
        type: 'error'
      })
      return
    }
    if (!submitData.detail_address) {
      $Message({
        content: '请输入详细地址',
        type: 'error'
      })
      return
    }

    if (this.id) {
      putUserAddress(this.id, submitData).then(res => {
        wx.navigateBack({
          delta: 1
        })
      }).catch(err => {
        console.log("TCL: handleSubmit -> err", err)
      })
    } else {
      postUserAddress(submitData).then(res => {
        wx.navigateBack({
          delta: 1
        })
      }).catch(err => {
        console.log("TCL: handleSubmit -> err", err)
      })
    }

  }
})