<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"

import { getToken } from "@@/utils/cache/cookies"
import { getLeaderListApi } from "../projectLeader/apis/index"
import { exportTemplateApi, getProgressListApi, importDataApi, sumbGroupApi } from "./api/index"

const tableData = ref([])
const total = ref(0)
const leaderList: any = ref([])
const delivery = ref([])
const status = ref([{ label: "原料采购", id: 1 }, { label: "小试", id: 2 }, { label: "中试", id: 3 }, { label: "放大生产", id: 4 }, { label: "暂停", id: 5 }])
const searchForm = ref({
  limit: 10,
  page: 1,
  project_id: "",
  status: "",
  technician: "",
  group_number: "",
  project_leader_id: "",
  delivery_date_s: "",
  delivery_date_e: ""

})
async function getLeaderList() {
  const res: any = await getLeaderListApi()
  if (res.code === 200) {
    leaderList.value = res.data.list
  }
}
getLeaderList()
async function getProgressList() {
  const res: any = await getProgressListApi(searchForm.value)
  if (res.code === 200) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}
getProgressList()
function handleSizeChange(val: any) {
  searchForm.value.limit = val
  getProgressList()
}
function handleCurrentChange(val: any) {
  searchForm.value.page = val
  getProgressList()
}

const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const title = ref("添加数据")
const formGroup = ref({
  project_id: "",
  delivery_date: "",
  technician: "",
  project_leader_id: "",
  group_number: null,
  status: "",
  remark: ""
})
function addGroup() {
  dialogVisible.value = true
}
async function subGroup(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const res: any = await sumbGroupApi(formGroup.value)
      if (res.code === 200) {
        ElMessage({
          message: "添加成功",
          type: "success"
        })
        dialogVisible.value = false
        await getProgressList()
        resetForm(formEl)
      }
    } else {
      ElMessage({
        message: "表单填写有误",
        type: "error"
      })
    }
  })
}
function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
  formGroup.value.remark = ""
  dialogVisible.value = false
}
const rules = reactive<FormRules>({
  project_id: [
    { required: true, message: "请输入项目编号", trigger: "blur" }
  ],
  delivery_date: [
    { required: true, message: "请输入交货日期", trigger: "blur" }
  ],
  technician: [
    { required: true, message: "请输入实验员", trigger: "blur" }
  ],
  project_leader_id: [
    { required: true, message: "请输入项目负责人", trigger: "blur" }
  ],
  group_number: [
    { required: true, message: "请输入小组", trigger: "blur" }
  ],
  status: [
    { required: true, message: "请输入当前状态", trigger: "blur" }
  ]
})
const fileList = ref([])
const actionUrl = `${import.meta.env.VITE_BASE_URL}/index.Project/importList`
const headers = ref({
  token: getToken()
})
async function uploadSuccess(response: any) {
  console.log("response", response)

  if (response.code === 200) {
    console.log(response.code)

    ElMessage({
      message: "上传成功",
      type: "success"
    })
    fileList.value = []
    getProgressList()
  } else {
    console.log(response.code)
    fileList.value = []
    ElMessage({
      message: response.msg,
      type: "error"
    })
  }
}
// 导出模板
async function exportTemplate() {
  try {
    const res: any = await exportTemplateApi()
    console.log(res)

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
    document.body.removeChild(link)
  } catch (e) {
    console.error("下载模板失败", e)
  }
}
async function exportData() {
  const data = {
    project_id: searchForm.value.project_id,
    status: searchForm.value.status,
    technician: searchForm.value.technician,
    project_leader_id: searchForm.value.project_leader_id,
    group_number: searchForm.value.group_number,
    delivery_date_s: delivery.value[0],
    delivery_date_e: delivery.value[1]
  }
  const res: any = await importDataApi(data)
  console.log(res)
}
async function searchGroup() {
  searchForm.value.delivery_date_s = delivery.value[0]
  searchForm.value.delivery_date_e = delivery.value[1]
  await getProgressList()
}
</script>

<template>
  <div class="progress_page">
    <el-row :gutter="10">
      <el-col :span="2">
        <el-input placeholder="项目编号" v-model="searchForm.project_id" />
      </el-col>
      <el-col :span="2">
        <el-select placeholder="当前状态" v-model="searchForm.status">
          <el-option
            v-for="(item, index) in status"
            :key="index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-input placeholder="实验员" v-model="searchForm.technician" />
      </el-col>
      <el-col :span="2">
        <el-select placeholder="项目负责人" v-model="searchForm.project_leader_id">
          <el-option v-for="(item, index) in leaderList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-input placeholder="小组" v-model="searchForm.group_number" />
      </el-col>
      <el-col :span="6">
        <el-date-picker type="daterange" range-separator="To" start-placeholder="交货开始" end-placeholder="交货结束" value-format="YYYY-MM-DD" v-model="delivery" />
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="searchGroup">
          搜索
        </el-button>
      </el-col>
      <el-col :span="2" :offset="2">
        <el-button type="success" @click="exportData">
          导出数据
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="exportTemplate">
          导出模板
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-button type="primary" @click="addGroup">
          添加数据
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-upload
          v-model:file-list="fileList" class="upload-demo"
          :action="actionUrl" :headers="headers" multiple :on-success="uploadSuccess"
        >
          <el-button type="success">
            导入数据
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="3">
        <el-button type="danger">
          批量删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="project_id" label="项目编号" width="180" />
      <el-table-column prop="delivery_date" label="交货日期" width="180" />
      <el-table-column prop="status" label="当前状态" />
      <el-table-column prop="technician" label="实验员" />
      <el-table-column prop="project_leader_name" label="项目负责人" />
      <el-table-column prop="group_number" label="归属小组" />
      <el-table-column prop="admin_name" label="维护人" />
      <el-table-column prop="time" label="维护时间" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default>
          <el-button link type="danger" size="small">
            编辑
          </el-button>
          <el-button link type="primary" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="searchForm.page" v-model:page-size="searchForm.limit"
      :page-sizes="[10, 20, 30, 40, 50]" layout="sizes, prev, pager, next" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
    />
    <el-dialog v-model="dialogVisible" :title="title" width="500" @close="resetForm(ruleFormRef)">
      <el-form :model="formGroup" label-width="auto" style="max-width: 600px" :rules="rules" ref="ruleFormRef">
        <el-form-item label="项目编号" prop="project_id">
          <el-input v-model="formGroup.project_id" placeholder="输入项目编号" />
        </el-form-item>
        <el-form-item label="交货日期" prop="delivery_date">
          <el-date-picker v-model="formGroup.delivery_date" type="date" placeholder="交货日期" />
        </el-form-item>
        <el-form-item label="实验员" prop="technician">
          <el-input v-model="formGroup.technician" placeholder="输入实验员" />
        </el-form-item>
        <el-form-item label="项目负责人" prop="project_leader_id">
          <!-- <el-input v-model="formGroup.project_leader_id" /> -->
          <el-select v-model="formGroup.project_leader_id" placeholder="选择项目负责人">
            <el-option v-for="(item, index) in leaderList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属小组" prop="group_number">
          <el-input-number :min="1" :max="100" v-model="formGroup.group_number" placeholder="小组编号" />
        </el-form-item>
        <el-form-item label="当前状态" prop="status">
          <!-- <el-input v-model="formGroup.status" placeholder="输入当前状态" /> -->
          <el-select v-model="formGroup.status" placeholder="选择当前状态">
            <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formGroup.remark" placeholder="输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">
            取消
          </el-button>
          <el-button type="primary" @click="subGroup(ruleFormRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.progress_page {
  padding: 10px;

  .el-row {
    margin-bottom: 10px;
  }

  .el-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
