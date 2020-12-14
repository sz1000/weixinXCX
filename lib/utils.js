'use strict'

import regeneratorRuntime, {
  async
} from '../lib/httpServe/regeneration-runtime.js'

import { wechatLogin } from "../resource/user1.js";
import { putlinke } from "../resource/card.js";
import appConfig from './appConfig.js'

var app = getApp().globalData

const isKindOf = module.exports.isKindOf = function (value, type) {
  switch (typeof value) {
    case "string":
      return type === String;
    case "undefined":
      return type === undefined;
    case "boolean":
      return type === Boolean;
    case "number":
      return ((isNaN(type) && type !== type) && (isNaN(value) && value !== value)) ||
        (type === Number && !isNaN(value));
    case "function":
      return type === Function;
    case "object":
      if (value === null && type === null) return true;
      if (value === null || type === null) return false;
      if (typeof type !== "function") return false;
      if (type !== Object) {
        return value instanceof type;
      } else {
        return value.constructor === Object || value.constructor === undefined //for Object.create(null);
      }
      break;
    default:
      throw new Error("Not implemented");
  }
}

const makeErr = module.exports.makeErr = function (msg, opt) {
  if (!isKindOf(opt, Object)) opt = {};
  if (!isKindOf(msg, String)) {
    throwErr("Illegal error message", {
      "disFiles": __filename,
      "type": TypeError
    })
  }

  if (isKindOf(opt.disFiles, String)) opt.disFiles = [opt.disFiles];

  const options = format.option({
    "disSelf": true,
    "disFiles": [],
    "code": undefined,
    "type": Error
  }, opt);

  const err = new options.type(msg);
  if (isKindOf(options.code, Number)) {
    err.code = options.code;
  }

  if (options.disSelf && options.disFiles.indexOf(__filename) === -1) {
    options.disFiles.push(__filename);
  }

  if (options.disFiles.length) {
    const stacks = err.stack.split("\n");
    for (let i = stacks.length; i >= 0; i--) {
      const stack = stacks[i];
      if (isKindOf(stack, String) && stack.trim().indexOf("at") === 0) {
        for (let j = 0; j < options.disFiles.length; j++) {
          if (stack.indexOf(options.disFiles[j]) !== -1) {
            stacks.splice(i, 1);
            break;
          }
        }
      }
    }
    err.stack = stacks.join("\n");
  }

  return err;
}

const throwErr = module.exports.throwErr = function (msg, opt) {

  let err = makeErr(msg, opt);
  throw err;

}


const format = module.exports.format = function (defaultValue, value) {
  const result = {};
  Object.keys(value).forEach(function (key) {
    if (defaultValue.hasOwnProperty(key)) {
      result[key] = value[key];
    } else {
      throw throwErr(`Invaild key: ${key}`);
    }
  });
  Object.keys(defaultValue).forEach(function (key) {
    if (value[key] === undefined) {
      result[key] = defaultValue[key];
    }
  });
  return result;
}

format.option = function (defaultValue, value) {
  const result = Object.create(null);
  const fResult = format(defaultValue, value);
  Object.keys(fResult).forEach(function (key) {
    result[key] = fResult[key];
  });
  return Object.freeze(result);
}

const merge = module.exports.merge = function (...params) {
  var result = {};
  for (var i = params.length - 1; i >= 0; i--) {
    let value = params[i];
    if (isKindOf(value, Object)) {
      Object.keys(value).forEach(function (key) {
        result[key] = value[key];
      });
    } else {
      throw throwErr(`Only Obejct can be merged`, {
        type: TypeError
      });
    }
  }
  return result;
}

const isNull = module.exports.isNull = function (obj) {
  if (isKindOf(obj, null) || isKindOf(obj, undefined)) {
    return true;
  } else if (isKindOf(obj, String)) {
    return obj === '';
  } else {
    return false;
  }
}

const freeze = module.exports.freeze = function (obj) {

  var propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function (name) {
    var prop = obj[name];

    if (typeof prop == 'object' && prop !== null)
      freeze(prop);
  });

  return Object.freeze(obj);
}

const seal = module.exports.seal = function (obj) {
  var propNames = Object.keys(obj);

  propNames.forEach(function (name) {
    var prop = obj[name];

    if (typeof prop == 'object' && prop !== null)
      seal(prop);
  });

  return Object.seal(obj);
}

const copy = module.exports.copy = function (obj) {
  if (isKindOf(obj, Array)) {
    return obj.map(function (ele) {
      return copy(ele);
    });
  } else if (isKindOf(obj, Object)) {
    var propNames = Object.keys(obj);
    var result = {}

    propNames.forEach(function (name) {
      var prop = obj[name];

      if (typeof prop == 'object' && prop !== null)
        result[name] = copy(prop)
      else
        result[name] = prop
    })

    return result
  } else {
    return obj
  }

}

const mean = module.exports.mean = function (obj) {
  Object.keys(obj).forEach((key) => {
    if (isKindOf(obj[key], undefined)) {
      delete obj[key]
    }
  })
  return obj
}


/*
*注册销售
*/
const registSalerHandle = module.exports.registSalerHandle = function() {
    return new Promise( async (resolved,rejected)=>{
      let loginInfo =  await login()
      if(loginInfo.isRegist){
        if(app.isSaler){
          wx.switchTab({
            url: '/pages/main/homePage/index'
          })
        }else {
          wx.redirectTo({
            url: `/pages/main/salerRegis/index`
          })
        }
      }else {
        wx.redirectTo({
          url: `/pages/main/regist/index?openCode=${loginInfo.openCode}`
        })
      }
    })
}



/*
*  登录逻辑判断
*/  
const login = module.exports.login = function() {
  let _this = this
  return new Promise((resolved,rejected)=>{
    wx.login({
      async success(res) {
        if (res.code) {
          //发送微信登陆验证
          let loginAuth = await wechatLogin({
            orgId: appConfig.orgId,
            code: res.code
          }).catch((error)=>{
              console.error('登录错误', error)
          })

          //没有注册，返回openCode 去注册
          if(loginAuth.data.data.openCode){
            resolved({
              isRegist:false,
              openCode:loginAuth.data.data.openCode
            })
          }else if(loginAuth.data.data.id){ 
            //已注册，本地缓存注册信息，和状态
            wx.setStorageSync('loginData',loginAuth.data.data)
            app.isSaler = loginAuth.data.data.isSaler
            app.isLogo = true
            resolved({
              isRegist:true
            })
          }
          //上传本地缓存点赞
          uploadLocalLike()
        } else {
          rejected(res.errMsg)
          console.error('登录失败！' + res.errMsg)
        }
      },
      fail(err){
        console.error("wx.login",err)
      }
    })
  })
}


const formatQuery = module.exports.formatQuery = function (params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  if (query.length) {
    query = '?' + query
  }
  return query
}


//上传本地点赞
const uploadLocalLike = module.exports.uploadLocalLike =function () {
  let cardArr = wx.getStorageSync('cardArr')
  if(cardArr !== '' && cardArr.length !== 0){
    cardArr.forEach((element)=>{
      putlinke(element).then((err)=>{
      }).catch((error)=>{
				console.log("TCL: uploadLocalLike -> error", error)
      })
    })
  }
}




/**
 *将网络图片转化成本地图片
 *
 * @param {*} data 网络图片URL
 * @returns 图片信息
 */

const getLocalImage = module.exports.getLocalImage = function (data) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: data,
      success: function (imgUrl) {
        resolve(imgUrl)
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

