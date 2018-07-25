<template>
  <AppList
    :list.sync="list"
    :api="'/student/performance/' + studentId + '/' + performanceId"
    title="学习报告"
    class="student-performance"
  >
    <el-form
      ref="list"
      :model="list"
      laber-position="left"
      label-width="80px"
    >
      <div style="display:flex">
        <el-form-item label="课程:">
          <span>{{ list.curriculum_name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="教师:">
          <span>{{ list.teacher_name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="学管师:">
          <span>{{ list.manager_name }}&nbsp;&nbsp;</span>
        </el-form-item>
      </div>
      <div style="display:flex;">
        <el-form-item label="课表名:">
          <span>{{ list.curriculum_detail_name }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="上课时间:">
          <span>{{ list.range }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="星星:">
          <span>{{ list.star_number }}&nbsp;&nbsp;</span>
        </el-form-item>
      </div>
    </el-form>
    <hr>
    <div
      class="student-performance__block"
    >
      <span class="student-performance__bottom">
        <span class="student-performance-block__text1">学习情况</span>
        <span class="student-performance-block__text2">得分情况</span>
      </span>
      <div
        v-for="(item,index) in list.learn_situation"
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
    <table
      class="student-performance__table"
      border="1">
      <tr>
        <th class="student-performance-table__text">课堂表现</th>
        <th>得分情况</th>
      </tr>
      <tr
        v-for="(item,index) in list.performance"
        :key="item.name + index">
        <td class="student-performance-table__text">{{ item.name }}</td>
        <td>{{ item.score_name }}</td>
      </tr>
    </table>
  </AppList>
</template>

<script>
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
      list: {},
    };
  },
};
</script>

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
.student-performance__table{
  width: 100%;
  border: 1px solid gainsboro;
  border-collapse:collapse;
  margin-top: 20px;
}
.student-performance__table th,.student-performance__table td{
  border: 1px solid gainsboro;
  padding: 10px 0px;
  color:gray;
  text-align: center;
}
.student-performance-table__text{
  text-align: left !important;
  padding-left: 20px !important;
}
</style>

