// 统一处理 Cookie

import { CacheKey } from "@@/constants/cache-key"
import Cookies from "js-cookie"

export function getToken() {
  return Cookies.get(CacheKey.TOKEN)
}

export function setToken(token: string) {
  Cookies.set(CacheKey.TOKEN, token)
}

export function removeToken() {
  Cookies.remove(CacheKey.TOKEN)
}
// 存储名字
export function getName() {
  return Cookies.get(CacheKey.USERNAME)
}
export function setName(name: any) {
  return Cookies.set(CacheKey.USERNAME, name)
}
export function removeName() {
  Cookies.remove(CacheKey.USERNAME)
}
