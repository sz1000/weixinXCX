// pages/main/userInfo/userInfoSet/components/verifyPhone/index.js
const {
  $Message
} = require('../../../../../../dist/base/index');
import {
  getCode,
  changeInfo
} from '../../../../../../resource/user1'

import {
  updateSalerInfo
} from '../../../../../../resource/saler'

let {userInfo} = getApp()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['button', 'button_fill'],
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tel: '',
    code: "",
    countDown: 60,
    isSaler: ''
  },
  lifetimes: {
    attached: function () {      
      userInfo.get().then(res=>{
        console.log("TCL: res", res)
        this.setData({
          tel:res.tel
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleInputPhone({
      detail
    }) {
      this.setData({
        tel: detail.value
      })
    },
    handleGetCode() {
      if (this.data.tel.length != 11) {
        $Message({
          content: '请输入正确的手机号',
          type: "error"
        })
        return
      }
      getCode({
        tel: this.data.tel
      }).then(res => {
        console.log("TCL: handleGetCode -> res", res)
        let codeInterval = setInterval(() => {
          if (this.data.countDown == 0) {
            clearInterval(codeInterval)
            this.setData({
              countDown: 60
            })
          } else {
            this.setData({
              countDown: this.data.countDown - 1
            })
          }
        }, 1000)
      }).catch(err => {
        console.log("TCL: handleGetCode -> err", err)

      })

    },
    handleSubmit() {
      if (this.data.tel.length != 11) {
        $Message({
          content: '请输入正确的手机号',
          type: "error"
        })
        return
      }

      if (this.data.code.length != 4) {
        $Message({
          content: '请输入正确的验证码',
          type: "error"
        })
        return
      }
      if (this.data.isSaler) {
        updateSalerInfo({
          tel: this.data.tel,
          code: this.data.code
        }).then(res => {
          console.log("修改电话成功")
          userInfo.set()
          this.triggerEvent('hide', {
            tel: this.data.tel
          })
        }).catch(err => {
          console.error(err)
          $Message({
            content: err.data.data,
            type: "error"
          })
        })
      } else {
        changeInfo({
          tel: this.data.tel,
          checkCode: this.data.code
        }).then(res => {
          console.log("TCL: handleSubmit -> res", res)
          userInfo.set()
          this.triggerEvent('hide', {
            tel: this.data.tel
          })
        }).catch(err => {
          console.error(err)
          $Message({
            content: err.data.data,
            type: "error"
          })
        })
      }

    },
    handleInputNumber({
      detail
    }) {
      this.setData({
        code: detail.value
      })
    },
    handleHide() {
      console.log("取消")
      this.triggerEvent('hide')
    }
  }
})