// component/global-select/index.js

import regeneratorRuntime, { async } from '../../lib/httpServe/regeneration-runtime.js'
import { porjectListGet } from "../../resource/product.js";
import { articlesLise } from "../../resource/material.js";
import { doctorsList } from "../../resource/doctor.js";


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:String
  },
  /**
   * 组件的初始数据
   */
  data: {
    current : 0,
    position : 'left',
    projectList : [],
    bindId:'',
    bindImg:'',//绑定同款项目图片
    showBackBtn : false,
    userInfo:''
  },
  //组件生命周期
  lifetimes: {
  // 在组件实例进入页面节点树时执行
   async attached() {
      let type = this.properties.type
      let res
      if(type === 'articleInfo'){
        res = await articlesLise()
      }else if(type === 'productInfo'){
        res = await porjectListGet()
      }else if(type === 'doctorInfo'){
        res = await doctorsList()
      }
      console.log("TCL: res", res.data.data)
      this.setData({
        projectList:res.data.data
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //选择回调
    handleCardChange(e){
      console.log(e)
      this.setData({
        current : e.detail.value
      });
    },
    targetHand(e){
      this.setData({
        current : e.currentTarget.dataset.target.id
      });
      let targetData = {
        type:this.properties.type,
        data:e.currentTarget.dataset.target
      }
      this.triggerEvent('change',targetData )
    }
  }
})
