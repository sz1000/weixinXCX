// component/global-top-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    subTitle:String,
    url:String,
    urlType:String
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
    handToUrl(){
      console.log("TCL: handToUrl -> this.data.url,", this.data.url)
      if (!this.data.url) return
      wx[`${ this.data.urlType || 'navigateTo'}`]({
        url: this.data.url,
        fail(error){
        console.error("TCL: global-tap-bar handToUrl -> error", error)
        }
      })
    }
  }
})
