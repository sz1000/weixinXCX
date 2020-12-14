// component/vst-article-card/index.js
import regeneratorRuntime, {
  async
} from '../../lib/httpServe/regeneration-runtime.js'
import {
  articleTop,
  getUserArticles,
  getOneArticle,
  deleteArticle,
  hideArticle,
  cancleTop,
  collectArticles,
  joinMyMaterial
} from "../../resource/material.js";



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
      observers: function (params) {
      }
    },
    add: Boolean, //是否展示来自素材库，判断的去文章详情页面还是H5页面
    addBind: Boolean, //是否展示下面的置顶、删除、分享按钮
    showIsJoin: Boolean, //是否展示加入我的素材
    maxNum: Number, //展示素材的最大个数
  },
  /**
   * 组件的初始数据
   */
  data: {
    haha:"1231231",
    demo: '',
    demoList: {},
    imgArray: [],
    maxNum: null,
  },
  observers: {
    "item": function (params) {
      this.setData({
        demo:params
      })
    }
  },
  /*
   *组件生命周期
   */
  lifetimes: {
    attached() {
      let tempobj = this.properties.item
      // tempobj.
      // for-in
      this.setData({

        demo: this.properties.item
      })
    },
    ready() {}
  },
  /**
   * 组件的方法列表
   */
  methods: {

    //去详情编辑页面
    toYulan: async function (e) {
      console.log(this.data.current)
      let articleId = e.currentTarget.dataset.article.id //获取文章id
      let articleData = await getOneArticle(articleId)
      let item = articleData.data.data
      wx.navigateTo({
        url: '/pages/main/h5Webview/index?id=' + articleId + '&withEdit=' + true + '&type=' + this.data.current
      })
    },
    //去商品详情
    goProductDetail: function (e) {
      console.log(e)
      let productId = e.currentTarget.dataset.product
      console.log(productId)

      wx.navigateTo({
        url: '/pages/project/projectDetail/index?projectId=' + productId
      })
    },
    //去案例详情
    goDemo: async function (e) {
      let articleId = e.currentTarget.dataset.article.id

      wx.navigateTo({
        url: '/pages/material/materialDetail/index?articleId=' + articleId
      })
    },
    //置顶
    toTop: async function (e) {
      console.log(e)
      let item = e.currentTarget.dataset.item
      console.log(item.id)
      if (item.order > 0) {
        await cancleTop(item.id)
      } else {
        await articleTop(item.id)
      }
      this.triggerEvent('myevent')
    },
    //删除文章
    delete: async function (e) {
      console.log(e)
      let that = this
      let item = e.currentTarget.dataset.item
      if (item.isCard) {
        wx.showToast({
          title: '展示在名片上的素材不能删除',
          icon: 'none',
          duration: 1000
        })
      }
      wx.showModal({
        title: '确认删除',
        content: '删除后无法恢复',
        success: async (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍候'
            })
            let result = await deleteArticle(item.id);
            if (result.msg = 'success') {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              wx.hideToast()
            }
          }
          wx.hideLoading()
          that.triggerEvent('myevent')
        }
      })
    },
    //分享
    showModal: function (e) {
      let sharePoint = e.currentTarget.dataset.item
      this.triggerEvent('myevent', sharePoint)
    },
    //加入我的素材
    addMyMaterial: async function (e) {
      console.log(this.properties.item)
      let index = e.currentTarget.dataset.index
      let articleIndex = `demo.isCopy`
      let articleId = e.currentTarget.dataset.article.id
      let res = await joinMyMaterial(articleId)
      if (res.data.msg == 'success') {
        this.data.demo.isCopy = true
        this.setData({
          showIsJoin:true,
          'item': this.data.demo
        })
      }
    },
  }
})