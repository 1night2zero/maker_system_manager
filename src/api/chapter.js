import request from '@/utils/request'

export default {
  // 查询课程大纲列表
  getAllChapterVideo(courseId) { // 分页获取讲师列表
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'post',
      data: courseId
    })
  }

}
