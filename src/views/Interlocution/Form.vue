<script>
/**
 * @overview 家长端管理 - 帮助中心 - 新增、编辑
 *
 * @author suyanping
 */
import { form } from '@/mixins';
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'InterlocutionForm',

  mixins: [form],

  data() {
    return {
      id: this.$route.params.id
        ? this.$route.params.id.split('_')[0]
        : undefined,

      lookId: this.$route.params.id
        ? this.$route.params.id.split('_')[1]
        : undefined,

      dataForm: {
        title: '',
        interlocution_type: null,
        answer: '',
      },

      rules: {
        title: [
          this.$rules.required('问题标题'),
        ],

        interlocution_type: [
          this.$rules.required('问题类型', 'number'),
        ],
      },

      interlocutionType: [],
    };
  },

  computed: {
    noticeTitle() {
      if (this.lookId) {
        return '查看问题';
      }

      if (this.id) {
        return '编辑问题';
      }

      return '新建问题';
    },
  },

  created() {
    this.getIndexList();

    this.getInfo();
  },

  methods: {
    getIndexList() {
      this.$http.get('/interlocution/create')
        .then((res) => {
          this.interlocutionType = res.interlocution_type;
        });
    },

    getInfo() {
      if (!this.id) return;

      this.$http.get(`/interlocution/${this.id}`)
        .then((res) => {
          this.dataForm = {
            id: res.id,
            title: res.title,
            interlocution_type: res.interlocution_type,
            answer: res.answer,
          };
        });
    },

    submitForm(submit) {
      submit()
        .then(() => {

        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
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
  <AppFormPage
    ref="dataForm"
    :model="dataForm"
    :rules="rules"
    :from="from"
    :object="noticeTitle"
    url="/interlocution"
    class="interlocution-form"
    label-width="100px"
    @on-submit="submitForm"
  >

    <el-form-item
      label="问题标题"
      prop="title"
    >
      <el-input
        v-model="dataForm.title"
        :maxlength="20"
        :disabled="!!lookId"
        type="text"
        placeholder="请输入问题标题"
        class="notification-form__text"/>
    </el-form-item>

    <el-form-item
      label="问题类型"
      prop="interlocution_type"
    >
      <el-select
        v-model="dataForm.interlocution_type"
        :disabled="!!lookId"
        placeholder="请选择问题类型">
        <el-option
          v-for="item in interlocutionType"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>

    </el-form-item>

    <el-form-item
      label="问题解答"
      prop="answer"
    >
      <AppTextArea
        v-model="dataForm.answer"
        :is-disable="!!lookId"/>

    </el-form-item>

    <div
      v-if="lookId"
      slot="footer"
      class="notification-form__footer">
      <el-button
        type="primary"
        @click="backPage">
        返回
      </el-button>
    </div>

  </AppFormPage>
</template>

<style lang="postcss">
.notification-form__text{
  width: 400px;
}

.notification-form__footer button{
  display: block;
  margin: 0 auto;
}
</style>
