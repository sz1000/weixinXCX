// pages/myCard/newCard/component/title-container/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    subhead:String,
    url:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toTarget(){
      if(this.data.url){
        wx.switchTab({
          url:this.data.url
        })
      }
    }
  }
})
