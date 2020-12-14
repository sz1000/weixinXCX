// component/global-prodact-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   item:{
    type:Object,
    value:{}
   },
   disable:{
     type:Boolean,
     value:false
   },
   actInfo:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  observers:{
    item:function (params) {
			console.log("TCL: params22222", params)
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toProjectDetail(e){
      if(this.properties.disable){
        return
      }
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/project/projectDetail/index?productId=' + id
      })
    }
  }
})
