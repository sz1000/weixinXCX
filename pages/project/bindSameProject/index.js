import regeneratorRuntime, { async } from '../../../lib/httpServe/regeneration-runtime.js'
import { porjectListGet } from "../../../resource/product.js";
import { articlesEdit,getOneArticle } from "../../../resource/material.js";

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
  handleCardChange({
    detail = {}
  }){
    if(this.data.projectList.length != 0){
      let imgUrl = this.data.projectList.filter((p)=>{
        return p.id == detail.value
      })
     this.setData({
       bindImg:imgUrl[0].coverImgUrl
     })
    }
    this.setData({
      current : detail.value
    });
  },
  save: async function () {
    //编辑绑定同款项目
    if(this.data.bindId){
      console.log(this.data.bindImg)
    let id = this.data.bindId
    let articleData = await getOneArticle(id)
    let item = articleData.data.data
    console.log(item)
    // let contentImg = [{content:{text:'',imgUrl:this.data.bindImg},type:'img'}]
    // console.log(item.content.concat(contentImg))
    console.log(this.data.current)
    let editData = await articlesEdit(id,{
        authorName:this.data.userInfo.nick_name,
        orgId:item.org_id,
        title:item.title,
        headText:item.head_text,
        type:item.type,
        headImg:item.head_img,
        avatar:this.data.userInfo.avatar,
        content:item.content,
        productId:this.data.current
        // content:item.content.concat(contentImg)
      })
      if(editData.data.msg == 'success'){
        console.log('绑定成功')
        wx.navigateTo({
          url:'/pages/main/bindSaveSuccess/index?articleId='+id
        })
      }
      console.log(editData)
    }
    
  },
  
  onLoad:async function (query) {
    var page = getCurrentPages();
    var that = this;
    if (page.length == 1) {
      this.setData({
        showBackBtn: true
      })
    }
    const userInfo = wx.getStorageSync('loginData')
    let res = await porjectListGet()
    var projectArr = []
    res.data.data.forEach((item) => {
      let projectData = {
        coverImgUrl:item.cover_img,
        name:item.name,
        price:item.price,
        id:item.id,
        type:item.type
      }
      projectArr.push(projectData)
    }); 
    this.setData({
      userInfo,
      bindId:query.articleId,
      projectList:projectArr
    })
  },
 //回到首页
 goToHomePage: function () {
  wx.reLaunch({
    url: '../../main/Index/index'
  })
}
})