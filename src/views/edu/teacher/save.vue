<template>
  <div class="app-container">
    <!--  添加讲师页面  -->
    <el-form :model="teacher" :rules="rules" ref="teacher" label-width="120px">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name" placeholder="请输入讲师名称"></el-input>
      </el-form-item>
      <!--   排序   -->
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="teacher.sort"
          :min="0"
          :max="10"
          placeholder="请输入排序"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input type="textarea" v-model="teacher.intro" placeholder="请输入讲师简介"></el-input>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input type="textarea" v-model="teacher.career" placeholder="请输入讲师资历"></el-input>
      </el-form-item>
      <el-form-item label="讲师级别" prop="level">
        <el-radio-group v-model="teacher.level">
          <el-radio label="1">高级讲师</el-radio>
          <el-radio label="2">首席讲师</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--   讲师头像   -->
      <el-form-item label="讲师头像" prop="avatar">
        <!--    头像缩略图    -->
        <pan-thumb v-if="teacher.avatar!==''" :image="OSS_PATH+teacher.avatar"/>
        <el-button type="primary" @click="imageCropperShow=true">更换头像</el-button>
        <image-cropper
          v-show="imageCropperShow"
          :key="imageCropperKey"
          :width="300"
          :height="300"
          :url="BASE_API+'/eduoss/fileoss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('teacher')">保存</el-button>
        <el-button @click="resetForm('teacher')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

export default {
  name: 'Save',
  components: { PanThumb, ImageCropper },
  data() {
    return {
      teacher: {
        name: '',
        sort: '',
        intro: '',
        career: '',
        level: '',
        avatar: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        career: [
          { required: true, message: '请输入讲师资历', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择讲师级别', trigger: 'change' }
        ],
        avatar: [
          { required: false, message: '请上传头像', trigger: 'change' }
        ]
      },
      imageCropperShow: false,
      imageCropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API,
      OSS_PATH: process.env.VUE_APP_OSS_PATH
    }
  },
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.getInfo(this.$route.params.id)
    }
  },
  methods: {
    close() { // 关闭弹窗方法
      this.imageCropperShow = false
      this.imageCropperKey++
    },

    cropSuccess(data) { // 上传成功方法
      this.imageCropperShow = false
      this.teacher.avatar = data.url
      this.imageCropperKey++
    },
    updateTeacherInfo(teacher) {
      this.$refs[teacher].validate(async valid => {
        if (valid) {
          const res = await teacherApi.updateTeacher(this.teacher)
          if (res.code === 20000) {
            this.$message.success('修改成功')
            this.$router.push('/teacher/table')
          } else {
            this.$message.error('修改失败')
          }
        } else {
          this.$message.error('请检查表单信息')
          return false
        }
      })
    },
    addTeacher(teacher) {
      this.$refs[teacher].validate(async valid => {
        if (valid) {
          const res = await teacherApi.addTeacher(this.teacher)
          if (res.code === 20000) {
            this.$message.success('添加讲师成功')
            this.$router.push('/teacher/table')
          } else {
            this.$message.error('添加讲师失败')
          }
        } else {
          this.$message.error('请检查表单信息')
          return false
        }
      })
    },
    submitForm(teacher) {
      if (this.$route.params && this.$route.params.id) {
        this.updateTeacherInfo(teacher)
      } else {
        this.addTeacher(teacher)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.teacher.avatar = URL.createObjectURL(file.raw)
    },
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then(res => {
        this.teacher = res.data.teacher
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .el-form-item {
    width: 50%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 178px;
    height: 178px;
  }
}
</style>
