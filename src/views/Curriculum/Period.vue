<script>
/**
 * @overview 商品中心 - 课程管理 - 课时管理
 *
 * @author suyanping
 */
import Draggable from 'vuedraggable';
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'CurriculumPeriod',

  components: {
    Draggable,
  },

  data() {
    return {
      id: this.$route.params.id,

      formData: {
        name: '',
        categories_name: '',
        course_number: '',
        content: [],
      },

      currCourseName: '',

      courseData: {},

      courseForm: {
        id: null,
        course_id: null,
        structure_id: null,
        subject_id: null,
        sort: null,
      },

      courseRules: {
        course_id: [
          this.$rules.required('课时', 'number'),
        ],
      },

      courseId: null,

      subjectId: null,

      subjectList: [],

      subjects: [],

      structureList: [],

      treeProps: {
        label: 'name',
        children: 'leaf',
      },

      visible: false,

      isCheck: null,

      structureId: null,

      current_page: 1,

      current_size: 10,

      total: 0,

      sortLoading: false,
    };
  },

  created() {
    this.getCourseList();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.curriculum.${key}`, text);
    },

    getCourseList() {
      this.$http.get(`/curriculum/course/${this.id}`)
        .then((res) => {
          this.formData = res;
        });
    },

    dragCourseware({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return;

      this.sortLoading = true;

      const target = this.formData.content
        .find((item, index) => index === oldIndex);

      const { id } = target;

      const url = `/curriculum/course/${id}`;

      this.$http.post(url, {
        ...target,
        sort: newIndex + 1,
      })
        .then(() => this.getCourseList())
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        })
        .finally(() => {
          this.sortLoading = false;
        });
    },

    delCourse(id) {
      this.$confirm(
        '确定删除该课时？',
        '删除确认',
        {
          showCancelButton: true,
          type: 'warning',
          confirmButtonText: '删除',
          confirmButtonClass: 'el-button--danger',
        })
        .then(() => this.sureDeleteCourse(id));
    },

    sureDeleteCourse(id) {
      this.$http.delete(`/curriculum/course/${id}`)
        .then(() => {
          this.getCourseList();

          this.$alert(
            '删除成功',
            '删除确认',
            {
              confirmButtonText: '我知道了',
              type: 'success',
              confirmButtonClass: 'success',
            });
        })
        .catch(({ message }) => {
          this.$alert(
            message,
            '删除确认',
            {
              confirmButtonText: '我知道了',
              type: 'warning',
              confirmButtonClass: 'el-button--danger',
            });
        });
    },

    updateCourse(id, sort) {
      const isUpdate = this.checkPermission('course_store');

      if (!isUpdate) return;

      this.visible = true;

      this.courseId = id;

      this.subjectId = null;

      this.courseForm = {
        id,
        course_id: null,
        structure_id: null,
        subject_id: null,
        sort,
      };

      this.subjectList = [];

      this.structureList = [];

      this.courseData = {};

      this.currCourseName = '';

      this.isCheck = null;

      this.$http.get('/course/index_before')
        .then((res) => {
          this.subjectList = res.subjects;
        });
    },

    getStructure(id) {
      this.structureList = [];

      this.courseData = {};

      this.currCourseName = '';

      this.isCheck = null;

      this.courseForm = {
        ...this.courseForm,
        course_id: null,
        structure_id: null,
        subject_id: id,
      };

      const subject = this.subjectList
        .find(item => item.id === id);

      if (subject) {
        this.structureList = subject.structure;
      }
    },

    selectStructure(data) {
      if (data.leaf) return;

      this.courseForm = {
        ...this.courseForm,
        course_id: null,
        structure_id: data.id,
      };

      this.isCheck = null;

      this.currCourseName = data.name;

      this.structureId = data.id;

      this.current_size = 10;

      this.current_page = 1;

      this.getCourseData();
    },

    checkCourse(id) {
      this.isCheck = id;

      this.courseForm = {
        ...this.courseForm,
        course_id: id,
      };
    },

    onSizeChange(per_page) {
      this.current_size = per_page;

      this.current_page = 1;

      this.getCourseData();
    },

    onCurrentChange(page) {
      this.current_page = page;

      this.getCourseData();
    },

    getCourseData() {
      const url = `/course?page=${this.current_page}&per_page=${this.current_size}&equal[structure_id]=${this.structureId}`;

      this.$http.get(url)
        .then((res) => {
          this.courseData = res;
        });
    },

    submitEdition(submit) {
      submit()
        .then(() => this.updateCourseList());
    },

    updateCourseList() {
      this.$http.post(`/curriculum/course/${this.courseId}`, this.courseForm)
        .then(() => this.getCourseList());
    },
  },
};
</script>

<template>
  <div class="curriculum-period">
    <header>
      <h2 class="curriculum-period-header__title">课时管理</h2>

      <div class="curriculum-period-header__block">
        <p>课程名称： {{ formData.name }}</p>
        <p>所属品类： {{ formData.categories_name }}</p>
        <p>课时数： &nbsp;&nbsp;&nbsp;{{ formData.course_number }}</p>
      </div>
    </header>

    <div
      v-loading.lock="sortLoading"
      v-if="checkPermission('course_index')"
      class="curriculum-period-body">

      <Draggable
        :value="formData.content"
        @end.stop="dragCourseware">

        <div
          v-for="(item,index) in formData.content"
          :key="item.id"
          style="display:inline-block;"
          @click="updateCourse(item.id,item.sort)">

          <div
            v-if="item.name"
            class="curriculum-period-body__block">
            <span>{{ index + 1 }}</span>
            <p class="curriculum-period-body__title">{{ item.name }}</p>
            <p>课件数：{{ item.ware_number }}</p>
            <p>游戏数：{{ item.game_number }}</p>
            <i
              v-if="checkPermission('course_delete')"
              class="el-icon-delete"
              @click.stop="delCourse(item.id)"/>
            <i
              v-else
              class="curriculum-period-body__display"/>
          </div>

          <div
            v-else
            class="curriculum-period-body__empty"
          >
            <span>{{ index + 1 }}</span>
            <i class="el-icon-plus"/>
          </div>
        </div>

      </Draggable>

    </div>


    <AppFormDialog
      ref="courseDialog"
      :visible.sync="visible"
      :rules="courseRules"
      :model="courseForm"
      object="选择课时"
      width="1000px"
      label-width="1px"
      @on-submit="submitEdition"
    >
      <el-form-item
        label=" "
        prop="course_id">

        <el-select
          v-model="subjectId"
          placeholder="请选择学科"
          style="margin-bottom: 20px;"
          @change="getStructure(subjectId)"
        >
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>

        <div class="curriculum-period__content">

          <el-tree
            ref="tree"
            :props="treeProps"
            :data="structureList"
            highlight-current
            default-expand-all
            node-key="id"
            children="leaf"
            empty-text=""
            class="curriculum-period__course"
            @node-click="selectStructure"
          />

          <div class="curriculum-period__info">
            <span>{{ currCourseName }}</span>
            <hr>
            <div
              class="curriculum-period-info__block"
              style="display:flex;flex-wrap:wrap;">
              <div
                v-for="item in courseData.data"
                :key="item.id"
                class="curriculum-period-info__course"
                @click="checkCourse(item.id)">
                <div class="curriculum-period-info__course__title">{{ item.name }}</div>
                <p>课件数：{{ item.ware_number }}</p>
                <p>游戏数：{{ item.game_number }}</p>
                <span
                  v-if="isCheck === item.id"
                  class="curriculum-period-info__check">
                  <i class="el-icon-check"/>
                </span>
              </div>
            </div>

            <footer
              class="curriculum-period-footer"
            >
              <el-pagination
                v-if="courseData.last_page > 1"
                :current-page="current_page"
                :page-sizes="[10, 20]"
                :page-size="current_size"
                :total="courseData.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
              />
            </footer>
          </div>

        </div>
      </el-form-item>

    </AppFormDialog>

  </div>
</template>

<style lang="postcss">
.curriculum-period-header__title{
  font-size: 1rem;
  margin-bottom: 30px;
}

.curriculum-period-body__block,
.curriculum-period-body__empty{
  display: inline-block;
  cursor: pointer;
  text-align: center;
  width: 150px;
  height: 150px;
  background: #E1E1E1;
  margin: 20px 20px 0 0;
  position: relative;
  & span{
    display: inline-block;
    background: #F0F0F0;
    width: 25px;
    line-height: 25px;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
  }
  & .el-icon-delete{
    font-size: 23px;
  }
}
.curriculum-period-body__display{
  display: inline-block;
  width: 23px;
  height: 21px;
}

.curriculum-period-body__title{
  width: 130px;
  text-align: center;
  padding-left: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.curriculum-period-body__empty{
  top: 12px;
  & .el-icon-plus{
    font-size: 23px;
    position: absolute;
    left: 60px;
    top: 65px;
  }
}

.curriculum-period__content{
  display: flex;
  margin-bottom: 20px;
}

.curriculum-period__course{
  width: 25%;
  flex-shrink: 0;
  border-right: 1px solid rgba(232,237,250);
}

.curriculum-period__info{
  width: 72%;
  margin-left: 20px;

}

.curriculum-period-info__block>div{
    display: inline-block;
    cursor: pointer;
    text-align: center;
    width: 150px;
    height: 150px;
    background: #E1E1E1;
    margin: 20px 20px 0 0;
    position: relative;
}

.curriculum-period-info__course__title{
  margin-top: 5px;
  line-height: 20px;
}

.curriculum-period-info__course>p{
  margin: 0;
  line-height: 30px;
}

.curriculum-period-footer{
  margin-top: 20px;
}

.curriculum-period-info__check{
  background: #818181;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 38px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  & .el-icon-check{
    font-size: 23px;
    color:white;
  }
}
</style>
