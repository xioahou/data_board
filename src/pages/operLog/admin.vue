<script setup lang="ts">
import { getLogListApi } from "./apis/index"

const tableData = ref([])
async function getLogList() {
  const res: any = await getLogListApi()
  console.log(res)
  tableData.value = res.data.list
}
getLogList()
</script>

<template>
  <div class="admin-page">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="姓名" />
      <!-- <el-table-column prop="address" label="Address" /> -->
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.admin-page {
  padding: 10px;
}
</style>
