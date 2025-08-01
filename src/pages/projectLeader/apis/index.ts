import { request } from "@/http/axios"

export function getLeaderListApi() {
  return request({
    url: "/index.Responsible/lists",
    method: "get"

  })
}
