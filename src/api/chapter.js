import request from '@/utils/request'

export default {
  // 查询课程大纲列表
  getAllChapterVideo(courseId) { // 分页获取讲师列表
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'post',
      data: courseId
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 根据id查询章节
  getChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },
  // 修改章节
  updateChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/${chapterId}`,
      method: 'delete'
    })
  }

}
