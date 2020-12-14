var app = getApp()
import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
// import materialServe from '../../../resource/material.js'
import appConfig from '../../../lib/appConfig.js'
import {
  collectArticles,
  getAllArticles,
  getAlbumArticles,
  getGraphicArticles,
  articlesAdd,
  joinMyMaterial
} from '../../../resource/material.js'

var pageNum = 1
var lastPage = null
Page({
  data: {
    spinShow: true,
    showFirstBox: true, //引导语
    optionID: '1',
    sweiperHeight: '',
    currentTab: 'recommend',
    eleData: [],
    openID: 'dd',
    isChecked: false,
    hintShow: false, //引导语
    noDataContent: '暂无数据',
    showBackBtn: false,
    template: '',
    recommend: [],
    template: 'myDiary',
    loadMoreTip: false,//下拉加载提示
    lastLoad: false, //下拉刷新到底提示
  },
  //去我的素材
  toMyMaterial:function () {
    wx.navigateTo({
      url:'/pages/material/myMaterial/index'
    })
  },
     //去商品详情
 goProductDetail:function (e) {
  console.log(e)
  let productId = e.currentTarget.dataset.product
  console.log(productId)

  wx.navigateTo({
   url:'/pages/project/projectDetail/index?projectId='+productId
  })
},
  //上拉加载
  async loadMoreData (e){
    console.log(e)
    var that = this
    let currentType = that.data.currentTab
    switch (currentType) {
      //推荐
      case 'recommend':
      if(e.detail.direction == 'bottom' && pageNum <= lastPage){
        pageNum++
        that.setData({
          loadMoreTip:true
        })
        let recommendData = that.data.eleData
        let resRec = await getAllArticles({
          page:pageNum
        })
        console.log(resRec)
        if(resRec.data.msg == 'success'){
          that.dataHandling(resRec.data.data).forEach((item) => {
            recommendData.push(item)
          })
          wx.hideLoading()
        }
        that.setData({
          eleData:recommendData,
          loadMoreTip:false
        })
      }else {
        that.setData({
          lastLoad:true,
          loadMoreTip:false
        })
      }  
        break;
      case 'albums':
      if(e.detail.direction == 'bottom' && pageNum <= lastPage){
        pageNum++
        that.setData({
          loadMoreTip:true
        })
        let albumData = that.data.eleData
        let resAlbum = await getAlbumArticles({
          type: 1,
          page:pageNum
        })
        if(resAlbum.data.msg == 'success'){
          that.dataHandling(resAlbum.data.data).forEach((item) => {
            albumData.push(item)
          })
          wx.hideLoading()
        }
        that.setData({
          eleData:albumData,
          loadMoreTip:false
        })
      }else {
        that.setData({
          lastLoad:true,
          loadMoreTip:false
        })
      }
        
        break;
      case 'richText':
      if(e.detail.direction == 'bottom' && pageNum <= lastPage){
        pageNum++
        that.setData({
          loadMoreTip:true
        })
        let textData = that.data.eleData
        let resText = await getGraphicArticles({
          type: 0,
          page:pageNum
        })
        if(resText.data.msg == 'success'){
          that.dataHandling(resText.data.data).forEach((item) => {
            textData.push(item)
          })
          wx.hideLoading()
        }
        that.setData({
          eleData:textData,
          loadMoreTip:false
        })
      }else{
        that.setData({
          lastLoad:true,
          loadMoreTip:false
        })
      }
        
        break;
      default:
        break;
    }
  },
  onLoad: async function () {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    this.currentTabChange({
      detail: {
        key: 'recommend'
      }
    })
  },

  //加入我的素材
addMyMaterial: async function (e) {
  let index = e.currentTarget.dataset.index
  let articleIndex = `eleData[${index}].isCopy`
  let item = e.currentTarget.dataset.article
  let res = await joinMyMaterial(item.id)
  if(res.data.msg == 'success'){
    this.setData({
      [articleIndex]:true
    })
  }
},

  //去预览
  toYulan: async function (e) {
    console.log(e)
    let articleId = e.currentTarget.dataset.article.id //获取文章id
    // let articleData = await getOneArticle(articleId)
    // let item = articleData.data.data

    wx.navigateTo({
      url: '../../main/h5Webview/index?id=' + articleId + '&isCollected=' + true
    })
  },
  dataHandling: function (result) {
    var eleData = []
    if (result != null) {
      result.forEach((item) => {
        let data = {
          productInfo:item.productInfo,
          doctorInfo:item.doctorInfo,
          isCopy:item.isCopy,
          isSelf:item.isSelf,
          headText: item.head_text,
          title: item.title,
          img: item.head_img,
          userName: item.author_name,
          type: item.type,
          userAvatar: item.avatar,
          id: item.id,
          imgArray: [item.head_img],
          type: item.type,
          article: item.content,
        }
        item.content.forEach((p) => {
          if (p.type == 'img') {
            data.imgArray.push(p.content.imgUrl)
          }
        })
        eleData.push(data)

      })
      return eleData
    } else {
      return []
    }
  },
  currentTabChange: async function ({
    detail
  }) {
    this.setData({
      lastLoad:false,
      currentTab: detail.key,
      scrollTop: 0
    })
    switch (detail.key) {
      case 'recommend':
      pageNum = 1
        let recommendMaterial = await getAllArticles({page:1}) //推荐文章
        lastPage = recommendMaterial.data.page.lastPage
        let resultRecom = recommendMaterial.data.data
        // eleData: this.dataHandling(resultRecom)
        this.setData({
          eleData:resultRecom
        })
        break;
      case 'albums':
        // 图册
        pageNum = 1
        let albumMaterial = await getAlbumArticles({
          type: 1,
          page:1
        })
        // lastPage = albumMaterial.data.page.lastPage
        let resultAlbum = albumMaterial.data.data
        // eleData:resultAlbum,
        this.setData({
          eleData: this.dataHandling(resultAlbum),
          template: 'album'
        })
        break;
        // case 'sVideo':
        //   this.setData({
        //     eleData: this.data.sVideo
        //   })
        //   break;
      case 'richText':
        //图文
        pageNum =1
        let graphicMaterial = await getGraphicArticles({
          type: 0,
          page:1
        })
        lastPage = graphicMaterial.data.page.lastPage
        let resultGraphic = graphicMaterial.data.data
        // eleData: this.dataHandling(resultGraphic),
        this.setData({
          eleData:resultGraphic,
          template: 'myDiary'
        })
        break;
    }
  },
    //回到首页
    goToHomePage: function () {
      wx.reLaunch({
        url: '../../main/Index/index'
      })
    }
})