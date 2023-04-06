<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList clearfix">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id"
      >
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
            <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id"
          >
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form style="text-align: center">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog title="添加章节" :visible.sync="dialogChapterFormVisible">
      <el-form :model="chapterForm" label-width="120px">
        <el-form-item label="章节名称">
          <el-input v-model="chapterForm.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapterForm.sort"
            :min="1"
            :max="10"
            label="描述文字"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改和添加课时小节表单  -->
    <el-dialog title="添加课时" :visible.sync="dialogVideoFormVisible">
      <el-form :model="videoForm" label-width="120px">
        <el-form-item label="课时名称">
          <el-input v-model="videoForm.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="videoForm.sort"
            :min="1"
            :max="10"
            label="描述文字"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-switch
            v-model="videoForm.isFree"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="视频资源">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4/xxx文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import chapter from '@/api/chapter'
import video from '@/api/video'

export default {
  name: 'Chapter',
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '',
      chapterVideoList: [],
      chapterForm: {
        title: '',
        sort: 0
      },
      videoForm: {
        title: '',
        sort: 0,
        isFree: 1
      },
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false // 小节弹框
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    this.getListChapter(this.courseId)
  },
  methods: {

    /* 小节 */
    openVideoDialog(chapterId) {
      // 弹窗
      this.dialogVideoFormVisible = true
      // 设置章节id
      this.videoForm.chapterId = chapterId
      // 清空表单
      this.videoForm.title = ''
      this.videoForm.sort = 0
      this.videoForm.isFree = 1
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.videoForm.courseId = this.courseId
      video.addVideo(this.videoForm).then(res => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 刷新
        this.getListChapter(this.courseId)
      })
    },
    // 删除小节
    removeVideo(id) {
      // 提示信息
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新
          this.getListChapter(this.courseId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改小节
    openEditVideo(id) {
      this.dialogVideoFormVisible = true
      this.videoForm.id = id
      video.getVideo(id).then(res => {
        this.videoForm = res.data.video
        console.log(this.videoForm)
      })
    },
    // 修改小节
    updateVideo() {
      video.updateVideo(this.videoForm).then(res => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 刷新
        this.getListChapter(this.courseId)
      })
    },
    // 保存小节
    saveOrUpdateVideo() {
      // 判断是添加还是修改
      if (this.videoForm.id) {
        // 修改
        this.updateVideo()
      } else {
        // 添加
        this.addVideo()
      }
    },
    /* 章节 */
    // 删除章节
    removeChapter(id) {
      // 提示信息
      this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新
          this.getListChapter(this.courseId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改章节
    openEditChapter(id) {
      // 弹框
      this.dialogChapterFormVisible = true
      chapter.getChapter(id).then(res => {
        this.chapterForm = res.data.chapter
      })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      // 弹框
      this.dialogChapterFormVisible = true
      // 清空表单
      this.chapterForm.title = ''
      this.chapterForm.sort = 0
    },
    // 添加章节
    addChapter() {
      this.chapterForm.courseId = this.courseId
      chapter.addChapter(this.chapterForm).then(res => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        // 刷新
        this.getListChapter(this.courseId)
      })
    },
    // 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapterForm).then(res => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示信息
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 刷新
        this.getListChapter(this.courseId)
      })
    },
    saveOrUpdate() {
      if (this.chapterForm.id) {
        this.updateChapter()
      } else {
        this.addChapter()
      }
    },
    // 根据课程id查询章节和小节
    getListChapter(id) {
      chapter.getAllChapterVideo(id)
        .then(res => {
          this.chapterVideoList = res.data.allChapter
        })
    },
    // 上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    // 下一步
    next() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style lang="scss" scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    position: relative;
    float: left;
    width: 100%;
  }

  p {
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .acts {
    float: right;
    font-size: 14px;
  }

}

.videoList {
  padding-left: 50px;

  p {
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
}

</style>
