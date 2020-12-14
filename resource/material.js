import httpServe from '../lib/httpServe/httpServe'

//文章列表
export function articlesLise() {
  return httpServe({
    url: `api/v1/articles`,
    method: 'get'
  })
}


//文章收藏
export function collectArticles(id, data) {
  return httpServe({
    url: `api/v1/articles/${id}/user/collect`,
    method: 'PUT',
    data: data,
  })
}
//查看文章（传文章id）
export function getOneArticle(id) {
  return httpServe({
    url: `api/v1/articles/${id}`,
    method: 'GET',
    Authorization: false
  })
}
//文章预览获取token
export function tokenToPreview(data) {
  return httpServe({
    url: 'api/v1/articles/token',
    method: 'POST',
    data: data,
    // Authorization: false
  })
}
//我的收藏列表
export function myCollection(data) {
  return httpServe({
    url: 'api/v1/articles/user/collect',
    method: 'GET',
    data
  })
}
//加入名片
export function cardJoin(id) {
  return httpServe({
    url:`api/v1/articles/${id}/user/card`,
    method:'PUT'

  })
}
//置顶
export function articleTop(id) {
  return httpServe({
    url: `api/v1/articles/${id}/top`,
    method: 'PUT',
  })
}
//取消置顶
export function cancleTop(id) {
  return httpServe({
    url:`api/v1/articles/${id}/top/cancel`,
    method:'PUT'
  })
}
//隐藏
export function hideArticle(id,data) {
  return httpServe({
    url:`api/v1/articles/${id}/hide`,
    method:'PUT',
    data
  })
}
//新建文章
export function articlesAdd(data) {
  return httpServe({
    url: `api/v1/articles/`,
    method: 'post',
    data: data
  })
}
//文章编辑
export function articlesEdit(id, data) {
  return httpServe({
    url: `api/v1/articles/${id}`,
    method: 'put',
    data: data
  })
}
//文章预览
export function articlePreview(data) {
  return httpServe({
    url: 'api/v1/articles/token',
    method: 'POST',
    data: data,
    // Authorization: false
  })
}
//获取推荐文章
export function getAllArticles(data) {
  return httpServe({
    url: 'api/v1/articles',
    method: 'GET',
    data
  })
}
//获取首页推荐文章
export function getIndexArticle(data) {
  return httpServe({
    url:'api/v1/articles/?recommend=1',
    method:'GET',
    data,
    Authorization: false
  })
}
//获取图册文章
export function getAlbumArticles(data) {
  return httpServe({
    url: 'api/v1/articles',
    method: 'GET',
    data: data,
    // Authorization: false
  })
}
//获取图文文章
export function getGraphicArticles(data) {
  return httpServe({
    url: 'api/v1/articles',
    method: 'GET',
    data,
    // Authorization: false
  })
}
//获取本人文章
export function getUserArticles(id, data) {
  return httpServe({
    url: `api/v1/articles/user/${id}`,
    method: 'GET',
    data
  })
}
//删除文章
export function deleteArticle(id) {
  return httpServe({
    url: `api/v1/articles/${id}`,
    method: 'DELETE'
  })
}

//分享素材二维码
export function getAppCode(data) {
  return httpServe({
    url:'api/v1/wechat/appcode',
    method:'POST',
    data
  })
}

//加入我的素材
export function joinMyMaterial(id) {
  return httpServe({
    url:`api/v1/articles/${id}/me`,
    method:'PUT'
  })
}