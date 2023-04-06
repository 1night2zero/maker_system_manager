<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="实例：机器学习项目课：从零基础到搭建chatGPT"/>
      </el-form-item>

      <!--   所属分类   -->
      <el-form-item label="课程分类">
        <el-select @change="subjectLevelChanged" v-model="courseInfo.subjectParentId" placeholder="一级分类">
          <el-option
            v-for="item in subjectFirstList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="item in subjectSecondList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--   课程讲师   -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="0" placeholder="实例：100" controls-positon="right"/>
      </el-form-item>

      <!--  课程简介   -->
      <el-form-item label="课程简介">
        <!--        <el-input v-model="courseInfo.description" :min="0" placeholder=""/>-->
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!--  课程封面   -->
      <el-form-item label="课程封面">
        <el-upload
          :action="BASE_API + '/eduoss/fileoss/upload'"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          :limit="1"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="courseInfo.cover" :src="OSS_PATH+courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number v-model="courseInfo.price" :min="0" placeholder="实例：100" controls-positon="right"/>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import course from '@/api/course'
import subject from '@/api/subject'
import Tinymce from '@/components/Tinymce/index.vue'
// const defaultForm = {
//   title: '',
//   subjectId: '',
//   subjectParentId：'',
//   teacherId: '-',
//   lessonNum: 0,
//   description: '',
//   cover: '',
//   price: 0
// }
export default {
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      courseId: '',
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '', // 二级
        subjectParentId: '', // 一级
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '',
        price: 0
      },
      teacherList: [],
      subjectFirstList: [],
      subjectSecondList: [],
      BASE_API: process.env.VUE_APP_BASE_API,
      OSS_PATH: process.env.VUE_APP_OSS_PATH
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourseInfo()
    } else {
      // 初始化所有讲师
      this.getListTeacher()
      // 初始化所有一级分类列表
      this.getFirstSubject()
    }
    this.getListTeacher()
    this.getFirstSubject()
  },
  methods: {
    // 上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    // 上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 分类列表改变时的方法
    subjectLevelChanged(value) {
      for (let i = 0; i < this.subjectFirstList.length; i++) {
        if (this.subjectFirstList[i].id === value) {
          this.subjectSecondList = this.subjectFirstList[i].children
          this.courseInfo.subjectId = this.subjectSecondList[i].id
        }
      }
    },
    // 查询一级分类
    getFirstSubject() {
      subject.getSubjectList().then(res => {
        this.subjectFirstList = res.data.list
      })
    },
    // 查询所有讲师
    getListTeacher() {
      course.getListTeacher().then(res => {
        this.teacherList = res.data.items
      })
    },
    // 添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(res => {
          this.$message.success('添加课程信息成功')
          this.$router.push({ path: `/course/chapter/${res.data.courseId}` })
        })
    },
    // 修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(res => {
          this.$message.success('修改课程信息成功')
          this.$router.push({ path: `/course/chapter/${this.courseId}` })
        })
    },
    // 下一步
    next() {
      // 判断表达是否为空 switch case
      switch (true) {
        case this.courseInfo.title === '':
          this.$message.error('课程名称不能为空')
          return
        case this.courseInfo.subjectId === '':
          this.$message.error('课程分类不能为空')
          return
        case this.courseInfo.teacherId === '':
          this.$message.error('讲师不能为空')
          return
        case this.courseInfo.description === '':
          this.$message.error('课程简介不能为空')
          return
        // case this.courseInfo.cover === '':
        //   this.$message.error('课程封面不能为空')
        //   return
        case this.courseInfo.price === '':
          this.$message.error('课程价格不能为空')
          return
      }

      // 判断是添加还是修改
      if (!this.courseInfo.id) {
        this.addCourse()
      } else {
        this.updateCourse()
      }
    },
    // 根据课程id查询
    getCourseInfo() {
      course.getCourseInfoById(this.courseId)
        .then(res => {
          // 在courseInfo课程基本信息，包含一级id和二级分类id
          this.courseInfo = res.data.courseInfoVo
          // 查询所有的分类，包含1级和2级
          subject.getSubjectList()
            .then(response => {
              // 获取所有的一级分类
              this.subjectFirstList = response.data.list
              // 把所有的一级分类数组进行遍历，找到当前课程的一级分类
              for (let i = 0; i < this.subjectFirstList.length; i++) {
                if (this.subjectFirstList[i].id === this.courseInfo.subjectParentId) {
                  // 找到当前课程的一级分类，把当前课程的二级分类赋值给subjectSecondList
                  this.subjectSecondList = this.subjectFirstList[i].children
                }
              }
            })
          // 初始化所有讲师
          this.getListTeacher()
        })
    }
  }

}
</script>

<style lang="scss" scoped>
.tinymce-container {
  line-height: 30px;

  .mce-content-body > p {
    margin: 5px 0;
  }
}
</style>
