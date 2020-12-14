import httpServe from "../lib/httpServe/httpServe"

//获取问诊卡字段
export function getInquiryList() {
  return httpServe({
    url:'api/v1/consult/struct',
    method:'GET',
    Authorization: false
  })
}

//提交问证卡
export function postInquiry(data) {
  return httpServe({
    url:'api/v1/consult',
    method:'POST',
    Authorization: true,
    data
  })
}
