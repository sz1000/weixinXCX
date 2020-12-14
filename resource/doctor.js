import httpServe from "../lib/httpServe/httpServe"

//获取医生列表
export function doctorsList(data) {
  return httpServe({
    url:'api/v1/doctors',
    method:'GET',
    data,
    Authorization: false
  })
}

//获取医生详情
export function doctorDetail(id,data) {
  return httpServe({
    url:`api/v1/doctors/${id}`,
    method:'GET',
    data,
    Authorization: false
  })
}