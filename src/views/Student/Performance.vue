<script>
/**
 * @overview 学生管理 - 查看课程 - 上课历史 - 课堂表现
 *
 * @author yehaifeng
 */
export default {

  name: 'StudentPerformance',

  data() {
    return {

      studentId: this.$route.params.id.split('_')[0],

      performanceId: this.$route.params.id.split('_')[1],

      columns: [
        { prop: 'class_name', label: '评比项' },
        { prop: 'curriculum_name', label: '得分情况' },
      ],
      list: {
        schedule: {},
        class: {},
        situation: [],
      },
    };
  },
  methods: {
    checkPermission(key, text) {
      return this.$permissions(`member_center.student.${key}`, text);
    },
  },
};
</script>

<template>
  <AppList
    :list.sync="list"
    :api="'/member_center/student/report/' + studentId + '/' + performanceId"
    title="学习报告"
    class="student-performance"
  >
    <el-form
      v-if="checkPermission('report')"
      ref="list"
      :model="list"
      laber-position="left"
      label-width="80px"
    >
      <div style="display:flex">
        <el-form-item label="班级:">
          <span>{{ list.class.name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="教师:">
          <span>{{ list.schedule.teacher_name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="辅师:">
          <span>{{ list.class.audience_name }}&nbsp;&nbsp;</span>
        </el-form-item>
      </div>
      <div style="display:flex;">
        <el-form-item label="课表名:">
          <span>{{ list.schedule.name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="上课时间:">
          <span>{{ list.schedule.date }}&nbsp;
            {{ list.schedule.start_time }}
            -{{ list.schedule.end_time }}</span>
        </el-form-item>
        <el-form-item label="星星:">
          <span>{{ list.schedule.star_number }}&nbsp;&nbsp;</span>
        </el-form-item>
      </div>
    </el-form>
    <hr>
    <div
      v-if="checkPermission('report')"
      class="student-performance__block"
    >
      <span class="student-performance__bottom">
        <span class="student-performance-block__text1">学习情况</span>
        <span class="student-performance-block__text2">得分情况</span>
      </span>
      <div
        v-for="(item,index) in list.situation"
        :key="item.name + index">
        <span class="student-performance__bottom">
          <span class="student-performance-block__text1">{{ item.name }}</span>
          <span class="student-performance-block__text2"/>
        </span>
        <span
          v-if="item.data"
          class="student-performance__bottom">
          <div
            v-for="info in item.data"
            :key="info.inspect_content + info.accuracy_name">
            <span class="student-performance-block__text1">{{ info.inspect_content }}</span>
            <span class="student-performance-block__text2">{{ info.accuracy_name }}</span>
          </div>
        </span>
      </div>
    </div>
  </AppList>
</template>


<style lang="postcss">
.student-performance .el-form-item__content span{
  display: inline-block;
  min-width: 150px;
}
.student-performance__block{
  width: 100%;
  border: 1px solid gainsboro;
  border-bottom: none;
  & span{
    display: inline-block;
  }
}
.student-performance__bottom{
  width: 100%;
  border-bottom: 1px solid gainsboro;
}
.student-performance-block__text1{
  width: 57%;
  border-right: 1px solid gainsboro;
  padding: 10px 0 10px 20px;
}
.student-performance-block__text2{
  width: 42.5%;
  text-align: center;
  padding: 10px 0;
}
</style>

