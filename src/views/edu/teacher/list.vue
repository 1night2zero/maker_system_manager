<template>
  <div class="app-container">
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherQuery.name" placeholder="请输入讲师名称"></el-input>
      </el-form-item>
      <el-form-item label="讲师级别">
        <el-select v-model="teacherQuery.level" placeholder="请选择讲师级别">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
        <el-date-picker
          v-model="teacherQuery.end"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column prop="name" label="讲师名称" width="180">
      </el-table-column>
      <el-table-column prop="intro" label="讲师简介">
      </el-table-column>
      <el-table-column prop="career" label="讲师资历" width="180">
      </el-table-column>
      <el-table-column prop="level" label="讲师级别" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success">高级讲师</el-tag>
          <el-tag v-else type="info">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="入驻时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="removeDataById(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
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
import teacher from '@/api/teacher'

export default {
  name: 'List',
  data() {
    return {
      list: [],
      page: 1,
      limit: 5,
      total: 0,
      teacherQuery: {},
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.page = page
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(res => {
          this.list = res.data.rows
          this.total = res.data.total
          this.loading = false
        })
    },
    resetList() {
      this.teacherQuery = {}
      this.getList()
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        teacher.removeTeacherById(id).then(res => {
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
.app-container {
  padding: 20px;

  .el-pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
