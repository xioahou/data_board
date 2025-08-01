import { request } from "@/http/axios"

export function getProgressListApi(params: any) {
  return request({
    url: "/index.Project/lists",
    method: "get",
    params
  })
}
export function sumbGroupApi(data: any) {
  const formData = new FormData()
  formData.append("id", data.id)
  formData.append("project_id", data.project_id)
  formData.append("delivery_date", data.delivery_date)
  formData.append("technician", data.technician)
  formData.append("project_leader_id", data.project_leader_id)
  formData.append("status", data.status)
  formData.append("remark", data.remark)
  formData.append("group_number", data.group_number)

  return request({
    url: "/index.Project/submit",
    method: "post",
    data: formData
  })
}
export function exportTemplateApi() {
  return request({
    url: "/index.Project/exportModel",
    method: "get",
    responseType: "blob" // 设置响应类型为blob
  })
}
export function importDataApi(data: any) {
  return request({
    url: "/index.Project/exportList",
    method: "get",
    params: data,
    responseType: "blob" // 设置响应类型为blob
  })
}
export function deleteAllApi(ids: any) {
  return request({
    url: "/index.Project/del",
    method: "post",
    data: {
      ids
    }
  })
}
