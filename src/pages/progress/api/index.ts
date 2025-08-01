import { request } from "@/http/axios"

export function getProgressListApi(params: any) {
  return request({
    url: "/index.Project/lists",
    method: "get",
    params
  })
}
export function sumbGroupApi(data: any) {
  return request({
    url: "/index.Project/submit",
    method: "post",
    data
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
    params: data
  })
}
