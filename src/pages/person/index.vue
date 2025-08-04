<script setup lang="ts">
import { delPersonApi, getPersonListApi, sumbitPersonApi } from "./apis/index"

const tableData = ref([])
async function getPersonList() {
  const res: any = await getPersonListApi()
  if (res.code === 200) {
    tableData.value = res.data.list
  }
}
getPersonList()
const dialogVisible = ref(false)
const personForm = ref({
  name: "",
  sort: ""
})
async function addPerson() {
  dialogVisible.value = true
}
function closeDialog() {
  dialogVisible.value = false
  personForm.value = {
    name: "",
    sort: ""
  }
}
async function submitPerson() {
  const res: any = await sumbitPersonApi(personForm.value)
  console.log(res)

  if (res.code === 200) {
    dialogVisible.value = false
    ElMessage.success("新增成功")
    getPersonList()
  }
}
function edit(data: any) {
  personForm.value.name = data.name
  personForm.value.sort = data.sort
  dialogVisible.value = true
}
async function del(id: any) {
  const res: any = await delPersonApi(id)
  if (res.code === 200) {
    ElMessage.success("删除成功")
    getPersonList()
  }
}
</script>

<template>
  <div class="person-page">
    <el-row>
      <el-col>
        <el-button type="primary" @click="addPerson">
          新增负责人
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="Id" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="admin_name" label="维护人" />
      <el-table-column prop="time" label="维护时间" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="del(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="新增负责人" width="500" @close="closeDialog">
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="姓名">
          <el-input v-model="personForm.name" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="personForm.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">
            取消
          </el-button>
          <el-button type="primary" @click="submitPerson" :disabled="personForm.name === '' || personForm.sort === ''">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.person-page {
  padding: 10px;

  .el-table {
    margin-top: 10px;
  }
}
</style>
