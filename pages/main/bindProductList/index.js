import regeneratorRuntime, { async } from '../../../lib/httpServe/regeneration-runtime.js'
import { porjectListGet } from "../../../resource/product.js";
import { articlesLise } from "../../../resource/material.js";

Page({
  data:{
    current : 0,
    position : 'left',
    projectList : [],
    bindId:'',
    bindImg:'',//绑定同款项目图片
    showBackBtn : false,
    userInfo:''
  },
  onLoad:async function (query) {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    // let res = await porjectListGet()
    let res = await articlesLise()
		console.log("TCL: res", res.data.data)
    this.setData({
      // bindId:query.articleId,
      projectList:res.data.data
    })
  },
  handleCardChange({
    detail = {}
  }){
    this.setData({
      current : detail.value
    });
  },
  save: async function () {
    //编辑绑定同款项目
    if(this.data.bindId){
  
    }
    
  },
})