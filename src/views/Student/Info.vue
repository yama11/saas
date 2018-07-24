<template>
  <div class="student-info">
    <header class="student-info__header">
      <h2 class="student-info__title">查看学生</h2>
    </header>
  </div>
</template>
<script>
/**
 *
 *@overview 学生管理 - 查看学生
 *
 *@author yehaifeng
 */

import { form } from '@/mixins';

export default{
  name: 'StudentInfo',


  mixins: [form],

  data() {
    return {

    };
  },

  computed: {

  },

  created() {
    this.getOrderInfo();
  },

  methods: {
  },
};
</script>
<style lang="postcss">
.student-info__title{
  padding-left: 1em;
}
.student-info__buyer{
  margin-top: 40px;
  padding-left: 4em;
}
.student-info__but{
  display: flex;
  justify-content: center;
}
.student-info-note{
  margin-bottom: 30px;
}
</style>

