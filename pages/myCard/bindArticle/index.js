import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
// import materialServe from '../../../resource/material.js'
import appConfig from '../../../lib/appConfig.js';
import {
  cardJoin,
  getUserArticles,
  getOneArticle,
} from '../../../resource/material.js'
import { getBindArticle } from "../../../resource/saler.js";


var app = getApp()

var pageNum = 1
var diaryLastPage = null
var bindId = null
var bindIndex = null
Page({
  data: {
    id: 8,
    showFirstBox: true,
    hintShow: false,
    scrollTop: '0',
    bottomLoadShow: false,
    topLoadShow: false,
    topLoadTip: '正在刷新页面',
    current: 'myDiary',
    shareUrl: '',
    sweiperHeight: '',
    currentTab: 0,
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
    lastLoad: false //下拉刷新到底提示 
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
    console.log('滑动到底部了')
    var that = this
    if (e.detail.direction == 'bottom' && pageNum <= diaryLastPage) {
      pageNum++
      that.setData({
        loadMoreTip: true
      })
      let myDiaryData = that.data.showingData
      if (myDiaryData.length == 0) return
      let resDiary = await getUserArticles(that.data.userInfo.id, {
        page: pageNum
      })
      console.log(resDiary)
      let data = resDiary.data.data
      if (resDiary.data.msg == 'success') {
        console.log(that.dataHandling(data))
        that.dataHandling(data).forEach((item) => {
          myDiaryData.push(item)
        })
        wx.hideLoading()
        that.setData({
          showingData: that.removeDuplicatedItem(myDiaryData),
          loadMoreTip: false
        })
      }
    } else {
      that.setData({
        lastLoad: true,
        loadMoreTip: false
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
  //加入名片
  toTop: async function (e) {

    let item = e.currentTarget.dataset.item
    let param = item.isCard ? 0 : item.id
    bindId = item.isCard ? null : item.id
    await cardJoin(param)
    this.onLoad()
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
      collcetData.forEach((item,index) => {
        switch (item.type) {
          case 0: //图文
            item.template = 'myDiary'
            break;
          case 1: //图册
            item.template = 'album'
            break;
        }
        let result = {
          title: item.title, //标题
          headText: item.head_text, // 顶部文案
          template: item.template,
          id: item.id,
          userName: item.author_name,
          userAvatar: item.avatar,
          imgArray: [
            item.head_img
          ],
          type: item.type,
          content: item.content,
          isCard: item.id == bindId ?true : false
        }
        item.content.forEach((p) => {
          if (item.content.length !== 0) {
            if (p.type == 'img') {
              result.imgArray.push(p.content.imgUrl)
            }
          }
        })
        // result = Object.assign({}, result, {
        //   userAvatar: this.data.userInfo.avatar,
        //   userName: this.data.userInfo.nick_name
        // })
        if(item.id != bindId || index == 0){
          this.data.myDiary.push(result)
        }
      });

      console.log(this.data.myDiary)
      return this.data.myDiary
    } else {
      return []
    }
  },
  update: async function () {

  },

  //关闭新建素材弹出浮层
  closeShowModal: function () {
    this.setData({
      showModal: false
    })
  },
  onLoad: async function () {
    const userInfo = wx.getStorageSync('loginData') //获取用户信息缓存
    this.setData({
      userInfo
    })
    //拉取绑定名片的文章
    let articleList = []
    let bindData = await getBindArticle()
    if(bindData.data.data != null){
      articleList.push(bindData.data.data)
      bindId = bindData.data.data.id
    }
    let res = await getUserArticles(userInfo.id)
    let concatArr =  articleList.concat(res.data.data)
    this.setData({
      showingData: this.dataHandling(concatArr),
      noDataContent: '暂无数据'
    })
    wx.hideLoading()
  },

})