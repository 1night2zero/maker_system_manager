import request from '@/utils/request'

export default {
  // 课程分类列表
  getSubjectList() { // 分页获取讲师列表
    return request({
      url: `/eduservice/edu-subject/getAllSubject`,
      method: 'get'
    })
  }

}
