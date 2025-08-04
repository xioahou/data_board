<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import { Plus, Search } from "@element-plus/icons-vue"
import { addAdminApi, changeAdminStatusApi, delAdminApi, getAdminListApi } from "./apis/index"

const adminList = ref([{ label: "超级管理员", value: "1" }, { label: "普通管理员", value: "2" }])
const rootList = ref([{ label: "添加", value: "add" }, { label: "删除", value: "del" }, { label: "编辑", value: "edit" }, { label: "导入", value: "import" }, { label: "导出", value: "export" }])
const searchParams = ref({
  limit: 10,
  page: 1,
  name: "",
  username: "",
  status: "",
  type: ""
})
const tableData = ref([])
async function getAdminList() {
  const res: any = await getAdminListApi(searchParams.value)
  if (res.code === 200) {
    tableData.value = res.data.list
  }
}
getAdminList()
async function changeAdminStatus(data: any) {
  const res: any = await changeAdminStatusApi(data)
  if (res.code === 200) {
    await getAdminList()
  }
}
async function changeAdmin(val: any) {
  await changeAdminStatus({
    id: val.id,
    status: val.status
  })
}
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()

const formAdmin = ref({
  username: "",
  password: "",
  name: "",
  type: "",
  power: [],
  id: ""
})
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ],
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" }
  ],
  type: [
    { required: true, message: "请选择管理员类型", trigger: "change" }
  ],
  power: [{
    required: true,
    message: "请选择管理员权限",
    trigger: "change"
  }]
})
function addAdmin() {
  dialogVisible.value = true
}
async function submitAdmin(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const sumbForm = {
        ...formAdmin.value,
        power: formAdmin.value.power.join(",")
      }
      const res: any = await addAdminApi(sumbForm)
      if (res.code === 200) {
        ElMessage({
          message: "新增成功",
          type: "success"
        })
        dialogVisible.value = false
        await getAdminList()
      }
    } else {
      console.log("error submit!", fields)
    }
  })
}
function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}
function clearSearch() {
  searchParams.value = {
    limit: 10,
    page: 1,
    name: "",
    username: "",
    status: "",
    type: ""
  }
  getAdminList()
}
function search() {
  getAdminList()
}
function edit(scope: any) {
  console.log(scope)

  dialogVisible.value = true
  formAdmin.value.id = scope.id
  formAdmin.value.username = scope.username
  formAdmin.value.password = scope.password
  formAdmin.value.name = scope.name
  formAdmin.value.type = String(scope.type)
  formAdmin.value.power = scope.power.split(",")
}
async function delAdmin(id: any) {
  const res: any = await delAdminApi(id)

  ElMessageBox.confirm(
    "确定删除?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(async () => {
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        })
        await getAdminList()
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败"
      })
    })
}
</script>

<template>
  <div class="admin-page">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="3">
          <el-input placeholder="用户名" v-model="searchParams.username" clearable @clear="clearSearch" />
        </el-col>
        <el-col :span="3">
          <el-input placeholder="姓名" v-model="searchParams.name" clearable @clear="clearSearch" />
        </el-col>
        <el-col :span="3">
          <!-- <el-input placeholder="状态" v-model="searchParams.status" clearable @clear="clearSearch"/> -->
          <el-select placeholder="选择状态" v-model="searchParams.status" @clear="clearSearch">
            <el-option label="上线" value="1" />
            <el-option label="下线" value="2" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <!-- <el-input placeholder="类型" v-model="searchParams.type" clearable @clear="clearSearch" />
            -->
          <el-select v-model="searchParams.type" placeholder="权限" @clear="clearSearch">
            <el-option v-for="(item, index) in rootList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" :icon="Search" @click="search">
            搜索
          </el-button>
        </el-col>
        <el-col :span="1" :offset="9">
          <el-button type="primary" :icon="Plus" @click="addAdmin">
            新增
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cccccc"
            :active-value="1" :inactive-value="2" @change="changeAdmin(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="update_time" label="维护时间" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="delAdmin(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="新增管理员" width="500">
      <el-form :model="formAdmin" label-width="auto" style="max-width: 600px" ref="ruleFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formAdmin.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formAdmin.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formAdmin.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formAdmin.type" placeholder="身份类型" style="width: 240px">
            <el-option v-for="(item, index) in adminList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="power">
          <el-select multiple v-model="formAdmin.power" placeholder="操作权限" style="width: 240px">
            <el-option v-for="(item, index) in rootList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">
            取消
          </el-button>
          <el-button type="primary" @click="submitAdmin(ruleFormRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-page {
  padding: 10px;

  :deep(.el-card) {
    margin-bottom: 10px;
  }
}
</style>
