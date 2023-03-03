import request from '@/utils/request'

export default {
  // 1 讲师列表（条件查询分页）
  // current当前页 limit每页记录数 teacherQuery条件对象
  getTeacherListPage(current, limit, teacherQuery) { // 分页获取讲师列表
    return request({
      url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      // teacherQuery条件对象，后端使用RequestBody获取数据
      // data表示把对象转换json进行传递到接口里面
      data: teacherQuery
    })
  },
  removeTeacherById(id) { // 删除讲师
    return request({
      url: `/eduservice/edu-teacher/deleteTeacher/${id}`,
      method: 'delete'
    })
  },

  addTeacher(teacher) { // 添加讲师
    return request({
      url: `/eduservice/edu-teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },

  getTeacherInfo(id) {
    return request({
      url: `/eduservice/edu-teacher/getTeacher/${id}`,
      method: 'get'
    })
  },

  updateTeacher(teacher) { // 修改讲师
    return request({
      url: `/eduservice/edu-teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }

}
