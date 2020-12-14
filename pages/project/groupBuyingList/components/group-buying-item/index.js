// pages/project/groupBuyingList/components/group-buying-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:Object
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
    handleToProductDtaile(e){
      let productId = e.currentTarget.dataset.productId
      wx.navigateTo({
        url: `/pages/project/projectDetail/index?productId=${productId}`
      });
    }
  }
})
