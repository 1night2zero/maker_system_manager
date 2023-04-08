<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <div class="main">
      <h3>课程信息</h3>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="课程标题">
              <el-input v-model="publishCourse.title" disabled/>
            </el-form-item>
            <el-form-item label="课程分类">
              <el-row
                type="flex"
                justify="space-between"
                align="middle"
              >
                <el-input v-model="publishCourse.subjectLevelOne" disabled/>
                <div style="width: 20px; text-align: center">-</div>
                <el-input v-model="publishCourse.subjectLevelTwo" disabled/>
              </el-row>
            </el-form-item>
            <el-form-item label="课程讲师">
              <el-input v-model="publishCourse.teacherName" disabled/>
            </el-form-item>
            <el-form-item label="总课时">
              <el-input v-model="publishCourse.lessonNum" disabled/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="课程封面">
              <img :src="OSS_PATH + publishCourse.cover" alt="" style="width: 100px; height: 100px;"/>
            </el-form-item>
            <!-- 课程描述 -->
            <el-form-item label="课程描述">
              <!-- 渲染富文本编辑器 -->
              <div class="description" v-html="publishCourse.description"></div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--      <h3>课程大纲</h3>-->
      <!--      <el-table-->
      <!--        :data="publishCourse.chapterList"-->
      <!--        border-->
      <!--        style="width: 100%"-->
      <!--      >-->
      <!--        <el-table-column-->
      <!--          prop="title"-->
      <!--          label="章节名称"-->
      <!--          width="180"-->
      <!--        >-->
      <!--        </el-table-column>-->
      <!--        <el-table-column label="课时列表">-->
      <!--          <el-table-column-->
      <!--            prop="title"-->
      <!--            label="课时名称"-->
      <!--            width="180"-->
      <!--          >-->
      <!--          </el-table-column>-->
      <!--          <el-table-column-->
      <!--            prop="free"-->
      <!--            label="是否免费"-->
      <!--            width="180"-->
      <!--          >-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-tag v-if="scope.row.free" type="success">免费</el-tag>-->
      <!--              <el-tag v-else type="danger">收费</el-tag>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
    </div>

    <!--  保存和发布按钮  -->

    <el-form style="text-align: center">
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="publish"
        >发布课程
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/course'

export default {
  name: 'Publish',
  data() {
    return {
      OSS_PATH: process.env.VUE_APP_OSS_PATH,
      saveBtnDisabled: false,
      courseId: '',
      publishCourse: {}
    }
  },
  created() {
    // 获取课程id
    this.courseId = this.$route.params.id
    this.getCoursePublishInfo()
  },
  methods: {

    // 根据课程id查询
    getCoursePublishInfo() {
      course.getPublishCourseInfo(this.courseId)
        .then(response => {
          this.publishCourse = response.data.publishCourse
        })
    },
    previous() {
      this.$router.push({ path: '/course/chapter/' + this.$route.params.id })
    },
    publish() {
      // 确认框
      this.$confirm('此操作将发布课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveBtnDisabled = true
        course.publishCourse(this.courseId).then(response => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
          this.$router.push({ path: '/course/list' })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .main {
    .description {
      width: 80%;
      height: 150px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 10px;

      ::v-deep p { // 解决v-html渲染的标签样式不生效
        margin: 0;
        line-height: 20px;
      }
    }
  }
}
</style>
