import regeneratorRuntime from '../../../lib/httpServe/regeneration-runtime.js'
import configUrl from '../../../lib/httpServe/config.js'

var app = getApp()

Page({
  data: {
    shareUrl: ''
  },
  onLoad: function (option) {
    console.log("----============")
    console.log(option)
    console.log(configUrl.apiHost)
      //打开分享
      wx.showShareMenu({
        withShareTicket:true,
        success:function (res) {
          console.log(res)
        },
        fail:function (err) {
          console.log(err)
        }
      })
    let bestUrl = configUrl.apiHost
    let params = ''
    if(option.withShare){
      console.log(bestUrl)
      this.setData({
        shareUrl:bestUrl+'salers/card/'+option.salerId
      })
    }else{
      // params = `articles/${option.id}?salerId=${option.salerId}&isShare=${option.isShare}`
      for (let item in option) {
			console.log("TCL: item", item)
      if (item == 'id') {
        params = `articles/${option[item]}?`
      } else {
        params += `&${item}=${option[item]}`
      }
    }
    console.log(params)
    this.setData({
      shareUrl: bestUrl + params
    })
    }
    
  }
})