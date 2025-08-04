import { request } from "@/http/axios"

export function getAdminListApi(data: any) {
  return request({
    url: "/auth.Admin/index",
    method: "get",
    params: data
  })
}
export function changeAdminStatusApi(data: any) {
  return request({
    url: "/auth.Admin/adminStatus",
    method: "post",
    data
  })
}
export function addAdminApi(data: any) {
  return request({
    url: "/auth.Admin/adminSubmit",
    method: "post",
    data
  })
}
export function delAdminApi(id: any) {
  return request({
    url: "/auth.Admin/adminDelete",
    method: "post",
    data: {
      id
    }
  })
}
