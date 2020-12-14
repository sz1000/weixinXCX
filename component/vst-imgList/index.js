Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgArrayData:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgArrayData:''
  },
  lifetimes:{
    attached: function () {
      let imgArrayData = this.properties.imgArrayData
      this.setData({
        imgArrayData,
      })
     },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})