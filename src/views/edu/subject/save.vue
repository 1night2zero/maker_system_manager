<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/01.xlsx'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/edu-subject/addSubject'"
          name="file"
          accept="application/x-xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Save',
  data() {
    return {
      loading: false,
      importBtnDisabled: false,
      BASE_API: process.env.VUE_APP_BASE_API,
      OSS_PATH: process.env.VUE_APP_OSS_PATH,
      fileUploadBtnText: '上传到服务器'
    }
  },
  methods: {
    fileUploadSuccess() { // 上传成功
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功'
      })
    },
    fileUploadError() { // 上传失败
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程分类失败'
      })
    },
    submitUpload() { // 上传到服务器
      this.loading = true
      this.importBtnDisabled = true
      this.fileUploadBtnText = '上传中...'
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
