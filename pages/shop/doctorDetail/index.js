import regeneratorRuntime, {
  async
} from "../../../lib/httpServe/regeneration-runtime.js";
import {
  doctorDetail
} from "../../../resource/doctor.js";
import {
  getOneArticle
} from "../../../resource/material.js";
import {
  productDetailGet
} from "../../../resource/product.js";

var app = getApp()

Page({
  data: {
    currentTab: 0,
    showBackBtn: false,
    doctor: '',
    materialsId: [],
    materialsArray: [],
    materials: [],
    productsId: [],
    productsArray: [],
    product: [],
    noDataContent: '',
    current: 'tab1',
    toModel: '',
    questions:[],
    noQuestions:'暂无问答',
    credentialsType:'doctorQualify',
    showDoctorBox:false,
    doctorBoxName:""
  },
  handleChange({
    detail
  }) {
    console.log(detail)
    this.setData({
      current: detail.key,
      toModel: detail.key
    });
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
  //去文章详情
  gotoMaterialDetail:function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.demo.id
    wx.navigateTo({
      url: '/pages/main/h5Webview/index?id='+id
    })
  },
  //去商品详情
  goToProductDetail:function (e) {
    let id = e.currentTarget.dataset.project.id
    wx.navigateTo({
      url: '/pages/project/projectDetail/index?projectId='+id
    })
  },
  //关闭医生证件modal
  closeModal:function () {
    this.setData({
      showDoctorBox:false
    })
  },
  //打开医生证件modal
  showDoctor:function (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      doctorBoxName:e.currentTarget.dataset.name,
      credentialsType:type,
      showDoctorBox:true
    })
  },
  onLoad: async function (option) {
    //打开分享
    wx.showShareMenu({
      withShareTicket:true,
      success:function (res) {
        console.log(res)
      },
      fail:function (err) {
        console.log(err)
      }
    })
    console.log(option)
    let id = option.doctorId
    let res = await doctorDetail(id, {
      withData: 1
    })
    let item = res.data.data
    console.log(item)
    let materialList = []
    item.articlesInfo.forEach((p) => {
      let data = {
        headText: p.head_text,
        userAvatar: p.avatar,
        userName: p.author_name,
        imgArray: [p.head_img],
        id:p.id,
        productInfo:p.productInfo,
        type:p.type,
        title:p.title
      }
      p.content.forEach((p) => {
        if (p.type == 'img') {
          data.imgArray.push(p.content.imgUrl)
        }
      });
      materialList.push(data)
    });

    console.log(materialList)
    this.setData({
      doctor: item,
      materials: materialList,
      product: item.productsInfo,
      questions:item.questions
    })
    console.log(res)
  },
  //回到首页
  goToHomePage: function () {
    wx.reLaunch({
      url: '../../main/Index/index'
    })
  }
})