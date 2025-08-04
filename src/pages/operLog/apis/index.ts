import { request } from "@/http/axios"

export function getLogListApi() {
  return request({
    url: "/auth.AdminLog/adminList",
    method: "get"
  })
}
