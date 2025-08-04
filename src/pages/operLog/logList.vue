<script setup lang="ts">
import { getLogApi } from "./apis/index"

const tableData = ref([])
const getForm = ref({
  limit: 10,
  page: 1,
  module: "",
  operate_name: "",
  primary_key: "",
  object_name: "",
  object_info: "",
  admin_name: "",
  time: ""
})
const total = ref(0)
async function getLog() {
  const res: any = await getLogApi(getForm.value)
  tableData.value = res.data.list
  total.value = res.data.total
}
getLog()
function search() {
  getLog()
}
function handleSizeChange(val: any) {
  getForm.value.limit = val
  getLog()
}
function handleCurrentChange(val: any) {
  getForm.value.page = val
  getLog()
}
</script>

<template>
  <div class="Loglist-page">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="3">
          <el-input v-model="getForm.module" placeholder="请输入模块" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="getForm.admin_name" placeholder="请输入操作人" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="getForm.operate_name" placeholder="请输入操作名称" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="getForm.primary_key" placeholder="请输入操作主键" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="getForm.object_name" placeholder="请输入对象名称" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="module" label="模块" width="180" />
      <el-table-column prop="operate_name" label="操作名称" width="180" />
      <el-table-column prop="primary_key" label="操作主键" />
      <el-table-column prop="object_name" label="对象名称" />
      <el-table-column prop="object_info" label="对象详细" />
      <el-table-column prop="admin_name" label="操作人" />
      <el-table-column prop="time" label="操作时间" />
    </el-table>
    <el-pagination
      v-model:current-page="getForm.page"
      v-model:page-size="getForm.limit"
      :page-sizes="[10, 20, 40, 50]"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.Loglist-page {
  padding: 10px;
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
