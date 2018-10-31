<script>
/**
 * @overview 家长端管理 - 系统消息 - 新增、编辑
 *
 * @author suyanping
 */
import { form } from '@/mixins';
import { times } from '@/utils';

export default {
  name: 'NotificationForm',

  mixins: [form],

  data() {
    return {
      pickerTime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },

      id: this.$route.params.id,

      dataForm: {
        title: '',
        content: '',
        push_time: '',
      },

      rules: {
        title: [
          this.$rules.required('消息标题'),
        ],

        content: [
          this.$rules.required('消息内容'),
        ],

        push_time: [
          this.$rules.required('推送时间', 'date'),

          {
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('推送时间不能为空'));

                return;
              }

              const nowTime = new Date().getTime();

              const changeTime = new Date(times.dateChange(value, 'noSecond')).getTime();

              if (nowTime > changeTime) {
                callback(new Error('请选择大于当前的时间'));

                return;
              }

              callback();
            },
          },
        ],
      },
    };
  },

  computed: {
    noticeTitle() {
      if (this.id) {
        return '编辑系统消息';
      }

      return '新建系统消息';
    },
  },

  created() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      if (!this.id) return;

      this.$http.get(`/notifications/${this.id}`)
        .then((res) => {
          this.dataForm = {
            title: res.title,
            content: res.content,
            push_time: new Date(res.push_time),
          };
        });
    },

    submitForm(submit) {
      this.dataForm.push_time = times.dateChange(this.dataForm.push_time, 'noSecond');
      submit()
        .then(() => {

        })
        .catch(() => {
          if (this.dataForm.push_time) {
            this.dataForm.push_time = new Date(this.dataForm.push_time);
          }
        });
    },
  },
};
</script>

<template>
  <AppFormPage
    ref="dataForm"
    :model="dataForm"
    :rules="rules"
    :from="from"
    :object="noticeTitle"
    url="/notifications"
    class="notification-form"
    label-width="100px"
    @on-submit="submitForm"
  >

    <el-form-item
      label="消息标题"
      prop="title"
    >
      <el-input
        v-model="dataForm.title"
        :maxlength="20"
        type="text"
        placeholder="请输入消息标题"
        class="notification-form__text"/>
    </el-form-item>

    <el-form-item
      label="消息内容"
      prop="content"
    >
      <el-input
        v-model="dataForm.content"
        :rows="8"
        type="textarea"
        placeholder="请输入消息内容"
        class="notification-form__textarea"/>

    </el-form-item>

    <el-form-item
      label="推送时间"
      prop="push_time"
    >
      <el-date-picker
        v-model="dataForm.push_time"
        :picker-options="pickerTime"
        format="yyyy-MM-dd HH:mm"
        type="datetime"
        placeholder="请选择推送时间"
        class="notification-form__time"/>
    </el-form-item>

  </AppFormPage>
</template>

<style lang="postcss">
.notification-form__text{
  width: 400px;
}

.notification-form__textarea{
  width: 600px;
}
</style>
