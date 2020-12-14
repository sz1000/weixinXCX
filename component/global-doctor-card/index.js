// component/global-doctor-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object,
    disable:{
      type:Boolean,
      value:false
    }
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
    toDoctorDetails(){
      if(this.properties.disable){
        return 
      }
      wx.navigateTo({
        url:'/pages/shop/doctorDetail/index?doctorId=' + this.properties.item.id
      })
    }
  }
})
