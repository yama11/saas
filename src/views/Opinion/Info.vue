<script>
/**
 * @overview 家长端管理 - 意见反馈 -- 详情
 *
 * @author suyanping
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'OpinionInfo',

  data() {
    return {
      id: this.$route.params.id,

      data: {},
    };
  },

  created() {
    this.getOpinionInfo();
  },

  methods: {
    getOpinionInfo() {
      this.$http.get(`/opinion/${this.id}`)
        .then((res) => {
          this.data = res;
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },
  },
};
</script>

<template>
  <div class="opinion-info">
    <h2 class="opinion-info__title">
      反馈详情
    </h2>

    <div
      class="opinion-info__content">

      <el-form
        ref="form"
        :model="data"
        label-width="80px">

        <el-form-item label="反馈内容:">
          {{ data.content }}
        </el-form-item>

        <el-form-item label="反馈类型:">
          {{ data.opinion_type_name }}
        </el-form-item>

        <el-form-item label="反馈人:">
          {{ data.phone }}
        </el-form-item>

        <el-form-item label="反馈时间:">
          {{ data.create_date }}
        </el-form-item>

        <el-form-item label="照片:">
          <div
            v-for="item in data.attachment"
            :key="item.id"
            class="opinion-info__image">
            <img :src="item.url">
          </div>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<style lang="postcss">
.opinion-info__title{
  font-size: 1rem;
}

.opinion-info__image{
  display: inline-block;
  margin-right: 20px;
}

.opinion-info__image img{
  width: 150px;
  height: 150px;
}
</style>
