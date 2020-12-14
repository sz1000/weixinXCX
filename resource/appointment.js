import httpServe from "../lib/httpServe/httpServe"

//获取预约列表
export function getAppointmentListAll(id,type) {
  if(!id){
    console.error("没有ID")
    return
  }
  return httpServe({
    url:`api/v1/appoint/?client_id=${id}${type || ''}`,
    method:'GET'
  })
}


//预约新增 | 修改
export function postAppointment({id,data,type}) {
  console.log("TCL: postAppointment -> type", type)
  console.log("TCL: postAppointment -> id", id)
  return httpServe({
    url:`api/v1/appoint/${id ? id : ''}`,
    method: type || 'POST',
    data
  })
}

//获取预约信息
export function getAppointment(id) {
  if(!id){
    console.error("getAppointment--没有获取和到ID")
    return
  }
  return httpServe({
    url:`api/v1/appoint/${id ? id : ''}`,
    method: "get"
  })
}

export function putAppointmentCancel(id,data) {
  if(!id){
    console.error("putAppointmentCancel--没有获取和到ID")
    return
  }
  return httpServe({
    url:`api/v1/appoint/cancel/${id}`,
    method: "put",
    data:{
      cancel_cause: data
    }
  })
}