export function downloadFile(res: any) {
  // 文件名提取（如果后端有设置）
  const disposition = res.headers?.["content-disposition"]
  console.log("文件名", res.headers)

  let filename = "template.xlsx"
  const matches = disposition?.match(/filename="?([^"]+)"?/)
  if (matches?.[1]) {
    filename = decodeURIComponent(matches[1])
  }

  // 触发下载
  const blob = new Blob([res.data])
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
}
