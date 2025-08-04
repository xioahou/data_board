import { request } from "@/http/axios"

export function getPersonListApi() {
  return request({
    url: "/index.Responsible/lists",
    method: "get"
  })
}
export function sumbitPersonApi(data: any) {
  return request({
    url: "/index.Responsible/submit",
    method: "post",
    data
  })
}
export function delPersonApi(id: any) {
  return request({
    url: "/index.Responsible/del",
    method: "post",
    data: {
      ids: id
    }
  })
}
