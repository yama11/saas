<script>
/**
 * @overview 家长端管理 - 系统消息 - 详情
 *
 * @author suyanping
 */
import { form } from '@/mixins';

export default {
  name: 'NotificationInfo',

  mixins: [form],

  data() {
    return {
      id: this.$route.params.id,

      dataForm: {
        title: '',
        content: '',
        push_time: '',
      },
    };
  },

  created() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      this.$http.get(`/notifications/${this.id}`)
        .then((res) => {
          this.dataForm = {
            title: res.title,
            content: res.content,
            push_time: res.push_time,
          };
        });
    },

    backPage() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },
  },
};
</script>

<template>
  <div class="notification-info">
    <h2 class="notification-info__title">
      系统消息详情
    </h2>

    <el-form
      ref="form"
      :model="dataForm"
      label-width="80px">

      <el-form-item
        label="消息标题"
        prop="title"
      >
        {{ dataForm.title }}
      </el-form-item>

      <el-form-item
        label="消息内容"
        prop="content"
      >
        <el-input
          v-model="dataForm.content"
          :rows="8"
          disabled
          type="textarea"
          placeholder="请输入消息内容"
          class="notification-info__textarea"/>

      </el-form-item>

      <el-form-item
        label="推送时间"
        prop="push_time"
      >
        {{ dataForm.push_time }}
      </el-form-item>

      <el-form-item
        label="推送用户"
        prop="push_user"
      >
        全体用户
      </el-form-item>

    </el-form>

    <div
      class="notification-info__footer">
      <el-button
        type="primary"
        @click="backPage">
        返回
      </el-button>
    </div>
  </div>
</template>

<style lang="postcss">
.notification-info__title{
  font-size: 1rem;
  margin-bottom: 50px;
}

.notification-info__textarea{
  width: 600px;
}

.notification-info__footer button{
  display: block;
  margin: 0 auto;
}
</style>
