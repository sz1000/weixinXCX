import regeneratorRuntime, {
  async
} from '../../../lib/httpServe/regeneration-runtime.js'
import {
  doctorsList
} from '../../../resource/doctor.js'
import WxParse from '../../../wxParse/wxParse.js'
import {
  getIndexArticle
} from '../../../resource/material.js'
import { getShopIntro } from "../../../resource/indexInfo.js";

var app = getApp().globalData
var pageNum = 1
var doctorLastPage = null
var demoLastPage = null
Page({
  data: {
    currentTab: 0,
    doctorList: [],
    demoList: [],
    demoListd: [],
    noDataContent: '正在加载',
    loadMoreTip: false,
    lastLoad: false, //下拉刷新到底提示
    imgArr:[]
  },
  //上拉加载
  async loadMoreData(e){
    console.log(e)
    var that = this
  
    let currentType = that.data.currentTab
    console.log(currentType)
    switch (currentType) {
      case 1:
      if (e.detail.direction == 'bottom' && pageNum <= doctorLastPage) {
        pageNum++
        that.setData({
          loadMoreTip: true
        })
      }
      
      let resDoctor = that.data.doctorList
      let doctorData = await doctorsList({page:pageNum})
      if(resDoctor.length == 0)return
      if(pageNum <= doctorLastPage){
        if(doctorData.data.msg == 'success'){
          doctorData.data.data.forEach((item) =>{
            resDoctor.push(item)
          })
          that.setData({
            doctorList:resDoctor,
            loadMoreTip:false
          })
        } 
      }else{
        that.setData({
          lastLoad: true,
          loadMoreTip: false
        })
      }
     
        break;
      case 2:
      if (e.detail.direction == 'bottom' && pageNum <= demoLastPage) {
        pageNum++
        that.setData({
          loadMoreTip: true
        })
      }
      let resDemo = that.data.demoList
      let demoData = await getIndexArticle({
        recommend:1,
        page:pageNum})
        console.log("TCL: loadMoreData -> demoData", demoData)
      if(resDemo.length == 0)return
      if(pageNum <= demoLastPage){
        if(demoData.data.msg == 'success'){
          demoData.data.data.forEach((item) =>{
           
            let demoListd = {
              userAvatar: item.avatar,
              id: item.id,
              productId: item.product_id,
              userName: item.author_name,
              imgArray: [item.head_img],
              title: item.head_text.replace(/\s*/g, ""),
              headText:item.head_text
            }
            item.content.forEach((p) => {
              if (p.type == 'img') {
                demoListd.imgArray.push(p.content.imgUrl)
              }
            })
            resDemo.push(demoListd)
          })
          that.setData({
            demoList:resDemo,
            loadMoreTip:false
          })
        }
      }else{
        that.setData({
          lastLoad: true,
          loadMoreTip: false
        })
      }
        break;
      default:
        break;
    }
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
  onLoad: async function (options) {
    if (options.id) {
      this.setData({
        currentTab: options.id
      })
    }
  },
  onShow:async function () {
    let shopIntro = await getShopIntro()
    if(shopIntro.data.msg == 'success'){
      let arr = shopIntro.data.data.slideshowArr
      let imgArr = arr.filter(item => item != null)
      this.setData({
        imgArr
      })
      let content = `${shopIntro.data.data.content}`
      WxParse.wxParse('PROJECT','html',content,this,5)
    }
    pageNum = 1    
     //获取医生
     let res = await doctorsList({page:pageNum})
     console.log("TCL: res", res)
     //获取文章
     let result = await getIndexArticle({
      recommend:1,
       page:pageNum
      })
     let newDemoList = []
     if (result.data.msg == 'success') {
       result.data.data.forEach((item) => {
         let demoListd = {
          userAvatar: item.avatar,
           id: item.id,
           productId: item.product_id,
           userName: item.author_name,
           imgArray: [item.head_img],
           title: item.title.replace(/\s*/g, ""),
           productInfo:item.productInfo,
           type:item.type,
           headText:item.head_text
         }
         item.content.forEach((p) => {
           if (p.type == 'img') {
             demoListd.imgArray.push(p.content.imgUrl)
           }
         })
         newDemoList.push(demoListd)
       });
     }
     console.log(newDemoList)
     if (res.data.msg == 'success' && result.data.msg == 'success') {
       doctorLastPage = res.data.page.lastPage
       demoLastPage = result.data.page.lastPage
       this.setData({
         doctorList: res.data.data,
         demoList:result.data.data
          // demoList: newDemoList,
         
       })
     }else{
       this.setData({
        noDataContent: '暂无数据'
       })
     }
  },
  //去案例详情
  gotoDemoDetail: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.demo.id
    wx.navigateTo({
      url: '/pages/material/materialDetail/index?articleId=' + id
    })
  },
  //去医生详情
  gotoDoctorDetail: function (e) {
    let id = e.currentTarget.dataset.doctor.id
    wx.navigateTo({
      url: '/pages/shop/doctorDetail/index?doctorId=' + id
    })
  },
 
  //点击切换
  clickTab: function (e) {
    console.log(e)
    var that = this;
    var tabNum = e.target.dataset.current;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (tabNum == 1) {
        this.setData({
          showMenu: true
        })
      } else {
        this.setData({
          showMenu: false
        })
      }
      that.setData({
        lastLoad:false,
        currentTab: e.target.dataset.current
      })
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      lastLoad:false,
      currentTab: e.detail.current
    })
  }
})