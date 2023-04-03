import request from '@/utils/request'

export default {
  // 添加课程信息
  addCourseInfo(courseInfo) { // 分页获取讲师列表
    return request({
      url: `/eduservice/edu-course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 查询所有讲师
  getListTeacher() {
    return request({
      url: `/eduservice/edu-teacher/findAll`,
      method: 'get'
    })
  },
  // 根据课程id查询课程信息
  getCourseInfoById(id) {
    return request({
      url: `/eduservice/edu-course/getCourseInfo/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  }

}
