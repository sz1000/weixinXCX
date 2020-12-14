import httpServe from '../lib/httpServe/httpServe'

//获取推荐商品类目 
export function categoryGet() {
  return httpServe({
    url: 'api/v1/categories',
    method: 'GET',
    Authorization: false
  })
}
//获取商品列表
export function porjectListGet(data) {
  return httpServe({
    url: `api/v1/products`,
    method: 'GET',
    data: data || '',
    Authorization: false
  })
}
//获取一级类目下的商品
export function productLevelOne(data) {
  return httpServe({
    url:'api/v1/products',
    method:'GET',
    data:data || '',
    Authorization:false
  })
}
//获取二级类目下的商品
export function productLevelTwo(data) {
  return httpServe({
    url: 'api/v1/products',
    method: 'GET',
    data: data,
    Authorization: false
  })
}
//获取商品详情
export function productDetailGet(id) {
  return httpServe({
    url: `api/v1/products/${id}`,
    method: 'GET',
    Authorization: false
  })
}
//获取一级类目

export function levelOneList(data) {
  return httpServe({
    url:'api/v1/categories',
    method:'GET',
    data,
    Authorization:false
  })
}

