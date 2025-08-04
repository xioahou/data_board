import { request } from "@/http/axios"

export function getLogListApi() {
  return request({
    url: "/auth.AdminLog/adminList",
    method: "get"
  })
}
export function getLogApi(data: any) {
  return request({
    url: "/auth.AdminLog/index",
    method: "get",
    params: data
  })
}
