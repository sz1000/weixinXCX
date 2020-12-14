import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
// import materialServe from '../../../resource/material.js'
import appConfig from '../../../lib/appConfig.js';
import {
  articleTop,
  getUserArticles,
  getOneArticle,
  deleteArticle,
  hideArticle,
  cancleTop,
  collectArticles
} from '../../../resource/material.js'

var app = getApp()

var pageNum = 1
var diaryLastPage = null

Page({
  data: {
    id: 8,
    showFirstBox: true,
    hintShow: false,
    scrollTop: '0',
    current: 'myDiary',
    eleData: '',
    myDiary: [], //我的日记
    collectedDiary: [],
    showingData: [],
    myDialog: '',
    mySave: '', //我的收藏
    actions5: [{
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
    noDataContent: '暂无数据',
    showBackBtn: false,
    materialData: '',
    userInfo: '',
    showModalStatus: false,
    token: '',
    loadMoreTip: false,
    lastLoad: false, //下拉刷新到底提示 
  },
  //去重
  removeDuplicatedItem(array) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i].id;
      for (let j = i + 1; j < array.length; j++) {
        if (array[i].id == array[j].id) {
          array.splice(j, 1);
          j--;
        }
      }
    }
    return array
  },
  //上拉加载
  loadMoreData: async function (e) {
    
    var that = this
      if(e.detail.direction == 'bottom' && pageNum <= diaryLastPage){
        pageNum++
        that.setData({
          loadMoreTip:true
        })
        let myDiaryData = that.data.showingData
        if(myDiaryData.length == 0)return
        let resDiary = await getUserArticles(that.data.userInfo.id, {
          page: pageNum
        })
        console.log(resDiary)
        let data = resDiary.data.data
        if (resDiary.data.msg == 'success') {
          console.log(that.dataHandling(data))
          // that.dataHandling(data).forEach((item) => {
          //   myDiaryData.push(item)
          // })
          console.log("---++++____________",resDiary)
          wx.hideLoading()
          that.setData({
            showingData: that.removeDuplicatedItem(myDiaryData),
            loadMoreTip:false
          })
        }
      }else {
        that.setData({
          lastLoad:true,
          loadMoreTip:false
        })
      }
     
  },
  //去详情编辑页面
  toYulan: async function (e) {
    console.log(this.data.current)
    let articleId = e.currentTarget.dataset.article.id //获取文章id
    let articleData = await getOneArticle(articleId)
    let item = articleData.data.data
    wx.navigateTo({
      url: '../../main/h5Webview/index?id=' + articleId + '&withEdit=' + true + '&type=' + this.data.current
    })
  },
  //隐藏
  hideArticle:async function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let hideNum = item.hide ? 0 : 1
    var hideNumIndexParam = `showingData[${index}].hide`
    wx.showModal({
      title: hideNum == 1 ? '确认隐藏' : '取消隐藏',
      content: hideNum == 1 ? '隐藏后将不展示在素材库' : '取消后素材库可见',
      success: async (res) => {
        if (res.confirm) {
        
          let result = await hideArticle(item.id,{hide:hideNum});
          if (result.msg = 'success') {
            that.setData({
              [hideNumIndexParam]:hideNum
            })
          }
        }
      }
    })
    
  },
  onMyEvent:async function (e) {
    var that = this
    if(e.detail != undefined){
      //打开分享好友和朋友圈弹窗
      that.data.shareItem = e.detail
      that.setData({
        showModalStatus: true
      })
  
    }else{
      that.onLoad()
    }
  },
  //置顶
  toTop: async function (e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    console.log(item.id)
    if(item.order > 0){
      await cancleTop(item.id)
    }else{
      await articleTop(item.id)
    }
    this.onLoad()
  },
  //取消分享
  closeModal: function () {
    this.setData({
      showModalStatus: false
    })
  },
  
  //分享好友
  onShareAppMessage(res) {
    let item = this.data.shareItem
    let url = `/pages/material/materialDetail/index?articleId=${item.id }&salerId=${this.data.userInfo.salerInfo.user_id}`
    return {
      title: item.headText ,
      path: url,
      imageUrl: item.imgArray[0]
    }
  },
  //分享朋友圈
  sharePic: function () {
    console.log('分享朋友圈')
    let item = this.data.shareItem
    console.log(item)
    wx.navigateTo({
      url: '/pages/material/materialShareFriend/index?articleId=' + item.id
    })
  },
  //删除文章
  delete: async function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if (item.isCard) {
      wx.showToast({
        title: '展示在名片上的素材不能删除',
        icon: 'none',
        duration: 1000
      })
    }
    if (that.data.current == 'myDiary') {
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
          that.onLoad()
        }
      })

    } else if (that.data.current == 'collectedDiary') {
      let res = await collectArticles(item.id, {
        state: 0
      })
      if (res.data.msg == 'success') {
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success'
        })
      }
      that.onLoad()
    }
  },
  //处理数据
  dataHandling: function (res) {
    wx.showLoading({
      title: '正在加载中...',
      mask: true
    })
    this.data.myDiary = []
    if (res == null) {
      var res = []
    }
    var collcetData = res.filter(function (p) {
      return p != null
    })
    if (collcetData.length != 0) {
      // this.
      // collcetData.forEach((item) => {
      //   let result = {
      //     productInfo:item.productInfo,
      //     doctorInfo:item.doctorInfo,
      //     hide:item.hide,
      //     order:item.order,//置顶标记
      //     copyId:item.copy_id,//来自素材库标记
      //     title: item.title, //标题
      //     headText: item.head_text, // 顶部文案
      //     type: item.type,
      //     id: item.id,
      //     userName: this.data.userInfo.nick_name,
      //     userAvatar: this.data.userInfo.avatar,
      //     imgArray: [
      //       item.head_img
      //     ],
      //     type: item.type,
      //     content: item.content,
      //     isCard: item.isCard
      //   }
      //   item.content.forEach((p) => {
      //     if (item.content.length !== 0) {
      //       if (p.type == 'img') {
      //         result.imgArray.push(p.content.imgUrl)
      //       }
      //     }
      //   })
      //   // result = Object.assign({}, result, {
      //   //   userAvatar: this.data.userInfo.avatar,
      //   //   userName: this.data.userInfo.nick_name
      //   // })
      //   this.data.myDiary.push(result)
      // });
      // this.data.myDiary
      return []
    } else {
      return []
    }
  },
  update: async function () {

  },
  //新建素材
  addBtn: function () {
    this.setData({
      showModal: true
    })
  },
  //去素材编辑
  goEdit: function (e) {
    var that = this;
    var viewText = e.target.dataset.text;
    switch (viewText) {
      case '图文':
        wx.navigateTo({
          url: '/pages/material/newGraphic/index'
        })
        break;
      case '图册':
        wx.navigateTo({
          url: '/pages/material/newAlbum/index'
        })
        break;
    }
    that.setData({
      showModal: false
    })
  },
  //关闭新建素材弹出浮层
  closeShowModal: function () {
    this.setData({
      showModal: false
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
  onLoad: async function () {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    this.setData({
      lastLoad:false,
      currentTop: 0
    });
    const userInfo = wx.getStorageSync('loginData') //获取用户信息缓存
    console.log("TCL: userInfo", userInfo)
    pageNum = 1
        let materialData = await getUserArticles(
         userInfo.id, {
            page: pageNum
          }
        ).catch((err) => {
          console.error(err)
        })
        console.log("TCL: materialData", materialData)
        if(materialData.data.msg == 'success'){
        diaryLastPage = materialData.data.page.lastPage
        }
        // this.dataHandling(materialData.data.data),
        this.setData({
          showingData: materialData.data.data,
          noDataContent: '暂无数据'
        })
        console.log(this.data.showingData)
        wx.hideLoading()
  },
//回到首页
goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
}
})