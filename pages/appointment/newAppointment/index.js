// pages/appointment/newAppointment/index.js
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import WxValidate from '../../../lib/WxValidate'
const {
  $Message
} = require('../../../dist/base/index');

import {
  postAppointment,
  getAppointment
} from '../../../resource/appointment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaShow: false,
    btnActive: '',
    showSelect: false,
    selectTarget: '',
    selectedServeType: '',
    selectedServe: {},
    submit: {
      client: "",
      tel: '',
      item_type: null,
      item_id: 0,
      appoint_time: '',
      remark: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      console.log("TCL: options.id", options.id)
      this.initDate(options.id)
      this.id = options.id
      wx.setNavigationBarTitle({
        title:"修改预约"
      })
    }else(
      this.id = null
    )
    this.initValidate()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  async initDate(id) {
    let serveData = await getAppointment(id)
    serveData = serveData.data.data
    this.setData({
      selectedServeType: serveData.item_type === 0 ? 'doctorInfo' : 'productInfo',
      selectedServe: serveData.item_type === 0 ? serveData.doctorInfo : serveData.productInfo,
      submit: serveData
    })
  },
  handTimeChange({
    detail
  }) {
    this.setData({
      textareaShow: false,
      'submit.appoint_time': detail
    })
  },
  handTextareaInput() {
    this.setData({
      textareaShow: true
    })
  },
  handAppointTiem(appointTime = '') {
    if (!appointTime) {
      this.setData({
        'submit.appoint_time': `${this.data.date} ${this.data.time}`
      }, () => {
        console.log(this.data.submit)
      })
    }
  },
  handSlectServe(e) {
    let id = e.currentTarget.dataset.id
    let selectTarget
    switch (id) {
      case '0':
        selectTarget = 'doctorInfo'
        break;
      case '1':
        selectTarget = 'productInfo'
        break;
      case '2':
        selectTarget = 'custom'
        break;
      default:
        console.error('type', '类型出错了')
        return
    }
    if (selectTarget !== 'custom') {
      this.setData({
        "submit.item_type": id,
        selectTarget,
        showSelect: true
      })
    } else {
      this.setData({
        'submit.item_type': 2,
        btnActive: id,
        selectTarget: 'custom',
        selectedServeType: 'custom',
      })
    }
  },
  hangSelectChange(target) {
    let targetData = target.detail.data
    let targetType = target.detail.type
    this.setData({
      selectedServeType: targetType,
      selectedServe: targetData,
      "submit.item_id": targetData.id,
      showSelect: false
    })
  },
  handTextInput(e) {
    let target = "submit." + e.target.id
    this.setData({
      textareaShow: false,
      [target]: e.detail.value
    })
  },
  handSubmit() {
    wx.showLoading({
      title: "提交中请等待"
    })
    let validata = Object.assign({
      time: this.data.time
    }, {
      date: this.data.date
    }, this.data.submit)
    if (!this.WxValidate.checkForm(validata)) {
      const error = this.WxValidate.errorList[0]
      $Message({
        content: error.msg,
        type: 'error'
      });
      return false
    }
    let tempData
    if (this.id) {
      tempData = {
        id: this.id,
        type: 'put',
        data: this.data.submit
      }
    } else {
      tempData = {
        data: this.data.submit
      }
    }
    let _this = this
    postAppointment(tempData).then((res) => {
      wx.hideLoading()
      let title = this.id ? '&title=修改' : ''
      wx.navigateTo({
        url: `/pages/appointment/success/index?id=${_this.id ? _this.id : res.data.data.id}${title}`
      })
    }).catch((error) => {
      wx.hideLoading()
      wx.showToast({
        title: error.data.data,
        icon: "none"
      })
      console.error('提交预约数据出错', error)
    })

  },
  initValidate: function (params) {
    let rules = {
      item_type: {
        required: true
      },
      appoint_time: {
        required: true
      },
      client: {
        required: true
      },
      tel: {
        required: true
      }
    }
    let messages = {
      item_type: {
        required: "请选择服务"
      },
      client: {
        required: "请输姓名"
      },
      appoint_time: {
        required: "请选择时期或者时间"
      },
      tel: {
        required: "请输入电话"
      }
    }

    this.WxValidate = new WxValidate(rules, messages)

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})