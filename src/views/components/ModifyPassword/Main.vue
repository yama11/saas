<script>
/**
 * @overview 密码修改提示组件
 *
 * @author huojinzhao
 */

import { userHistory } from '@/utils';
import { mapState } from 'vuex';

export default {
  name: 'ModifyPassword',

  data() {
    const repassword = this.$rules.repassword;

    const data = {
      oldPassword: '',
      newPassword: '',
      verification: '',
    };

    const rules = {
      oldPassword: this.$rules.password(),
      newPassword: repassword(data, 'oldPassword', false),
      verification: repassword(data, 'newPassword'),
    };

    return {
      data,
      rules,
      submitLoading: false,
      submitError: {},
    };
  },

  computed: {
    ...mapState({
      username: state => state.user.user.username,
    }),
  },

  methods: {
    cancelModification() {
      document.body.removeChild(this.$el);

      this.$destroy();
    },

    contrastOldPassword(rule, val, callback) {
      if (this.data.newPassword === this.data.oldPassword) {
        callback('新密码应与旧密码不同');
      } else {
        callback();
      }
    },

    toggleSubmitLoading() {
      this.submitLoading = !this.submitLoading;
    },

    preSubmit() {
      this.$refs.form.validate(valid => valid && this.submit());
    },

    submit() {
      const url = '/user/change_password';
      const data = {
        old_password: this.data.oldPassword,
        password: this.data.newPassword,
        repassword: this.data.verification,
      };

      this.toggleSubmitLoading();

      this.$http.patch(url, data)
        .then(this.submitSucceed)
        .catch(this.submitFailure)
        .finally(this.toggleSubmitLoading);
    },

    submitSucceed() {
      const history = userHistory.recover();

      if (history) {
        const record = { username: this.username };

        userHistory.preserve(
          userHistory.update(record, false, history),
        );
      }

      this.$http.removeToken();
    },

    submitFailure(error) {
      this.submitError = error;
    },
  },
};
</script>

<template>
  <el-dialog
    :show-close="false"
    class="modifypassword"
    title="修改密码"
    width="420px"
    visible
  >
    <el-form
      ref="form"
      :model="data"
      :rules="rules"
    >
      <el-form-item prop="oldPassword">
        <app-input-password
          v-model="data.oldPassword"
          placeholder="旧密码"
        />
      </el-form-item>
      <el-form-item prop="newPassword">
        <app-input-password
          v-model="data.newPassword"
          placeholder="新密码"
        />
      </el-form-item>
      <el-form-item prop="verification">
        <app-input-password
          v-model="data.verification"
          placeholder="再次输入新密码"
        />
      </el-form-item>
    </el-form>

    <AppFormAlert
      :contents="submitError"
    />

    <div slot="footer">
      <el-button
        :loading="submitLoading"
        type="primary"
        @click="preSubmit"
      >
        确定
      </el-button>
      <el-button
        @click="cancelModification"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<style lang="postcss">
.modifypassword {

  & .el-alert--error {
    margin-bottom: 0 !important;
  }
}
</style>
