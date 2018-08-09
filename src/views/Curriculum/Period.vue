<script>
/**
 * @overview 商品中心 - 课程管理 - 课时管理
 *
 * @author suyanping
 */
import Draggable from 'vuedraggable';

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

      courseData: [],

      courseForm: {
        id: null,
        course_id: null,
        structure_id: null,
        subject_id: null,
        sort: null,
      },

      courseRules: {},

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

    };
  },

  created() {
    this.getCourseList();
  },

  methods: {
    getCourseList() {
      this.$http.get(`/curriculum/course/${this.id}`)
        .then((res) => {
          this.formData = res;
        });
    },

    dragCourseware({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return;

      const target = this.formData.content
        .find((item, index) => index === oldIndex);

      const list = this.formData.content
        .filter((item, index) => index !== oldIndex);

      list.splice(newIndex, 0, target);

      this.formData.content = list.map((item, index) => ({
        ...item,
        sort: index + 1,
      }));
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

      this.courseData = [];

      this.currCourseName = '';

      this.isCheck = null;

      this.$http.get('/course/index_before')
        .then((res) => {
          this.subjectList = res.subjects;
        });
    },

    getStructure(id) {
      this.structureList = [];

      this.courseData = [];

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

      this.$http.get(`/course?equal[structure_id]=${data.id}`)
        .then((res) => {
          this.courseData = res.data;
        });
    },

    checkCourse(id) {
      this.isCheck = id;

      this.courseForm = {
        ...this.courseForm,
        course_id: id,
      };
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
              class="el-icon-delete"
              @click.stop="delCourse(item.id)"/>
          </div>

          <div
            v-else
            class="curriculum-period-body__empty">
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
      label-width="6em"
      @on-submit="submitEdition"
    >
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
            v-for="item in courseData"
            :key="item.id"
            @click="checkCourse(item.id)">
            <p>{{ item.name }}</p>
            <p>课件数：{{ item.courseware }}</p>
            <p>游戏数：{{ item.games }}</p>
            <span
              v-if="isCheck === item.id"
              class="curriculum-period-info__check">
              <i class="el-icon-check"/>
            </span>
          </div>
        </div>

      </div>

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
  & div{
    display: inline-block;
    cursor: pointer;
    text-align: center;
    width: 150px;
    height: 150px;
    background: #E1E1E1;
    margin: 20px 20px 0 0;
    position: relative;
  }
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
