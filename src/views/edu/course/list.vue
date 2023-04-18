<template>
  <div class="app-container">
    <!-- TODO 条件查询带分页 -->
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseQuery.name" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item label="讲师级别">
        <el-select v-model="courseQuery.status" placeholder="课程状态">
          <el-option label="未发布" value="Draft"></el-option>
          <el-option label="已发布" value="Normal"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
        <el-date-picker
          v-model="courseQuery.end"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="courseList" style="width: 100%">
      <el-table-column prop="title" label="课程名称" width="180">
      </el-table-column>
      <el-table-column prop="status" label="发布状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Normal'" type="success">已发布</el-tag>
          <el-tag v-else type="info">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="180">
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览量">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="添加时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button
              type="info"
              icon="el-icon-edit"
              size="mini"
              title="编辑课程信息"
              round
            >
            </el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              title="编辑课程大纲"
              plain
            >
            </el-button>
          </router-link>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            round
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- TODO 分页 -->
    <el-pagination
      :hide-on-single-page="total/limit < 2"
      @current-change="getList"
      :current-page="page"
      :page-size="limit"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import course from '@/api/course'

export default {
  name: 'CourseList',
  data() {
    return {
      loading: false,
      courseList: [],
      courseQuery: {
        name: '',
        status: '',
        begin: '',
        end: ''
      },
      page: 1,
      limit: 10,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      course.getCourseList().then(res => {
        this.courseList = res.data.list
        this.total = res.data.total
      })
    },
    removeDataById(id) {
      // 提示
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.deleteCourseById(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
