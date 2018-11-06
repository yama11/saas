<script>
/**
 * @overview 机构管理 - 分成弹框
 *
 * @author yehaifeng
 */
import form from '@/mixins/form';
import errorHandler from '@/components/AppFormAlert/errorHandler';


export default{

  name: 'OrganozationEdition',

  mixins: [form],

  props: {
    id: {
      type: Number,
      default: null,
    },

    visible: {
      type: Boolean,
      default: false,
    },

    found: {
      type: Boolean,
      default: false,
    },

    // 编辑数据
    formData: {
      type: Object,
      default: null,
    },

  },

  data() {
    return {

    };
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`system.department.${key}`, text);
    },

    submitEdition(submit) {
      submit()
        .then()
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    cancelEdition() {
      this.$emit('update:visible', false);
      this.$emit('getData');
    },
  },


};
</script>

<template>
  <AppFormDialog
    :visible="visible"
    :model="formData"
    :id ="formData.id"
    :close-on-click-modal="false"
    :class="checkPermission('proportion_update')?'':'department-dialog'"
    url="/department/proportion"
    label-width="7em"
    object="分成比例"
    width="500px"
    @on-submit="submitEdition"
    @update:visible="cancelEdition"
  >
    <div
      v-if="found"
      class="department_store"
    >
      机构创建成功，请确认该机构分成和结算信息</div>
    <el-form-item
      label="总部"
    >
      <div class="department-form">
        <div class="department_title">{{ formData.platform_name }}</div>
        <div class="department_input">
          <el-input
            v-model="formData.platform_percentage"
            :disabled="true"
            maxlength="5"
            placeholder="请输入"
          />&nbsp;%
        </div>
      </div>
    </el-form-item>
    <el-form-item
      label="城市合伙人"
    >
      <div class="department-form">
        <div class="department_title">{{ formData.partner_name }}</div>
        <div class="department_input">
          <el-input
            v-model="formData.partner_percentage"
            maxlength="5"
            placeholder="请输入"
          />&nbsp;%
        </div>
      </div>
    </el-form-item>
    <el-form-item
      label="区域运营商"
    >
      <div class="department-form">
        <div class="department_title">{{ formData.dealer_name }}</div>
        <div class="department_input">
          <el-input
            v-model="formData.dealer_percentage"
            maxlength="5"
            placeholder="请输入"
          />&nbsp;%
        </div>
      </div>
    </el-form-item>
    <el-form-item
      label="机构"
    >
      <div class="department-form">
        <div class="department_title">{{ formData.department_name }}</div>
        <div class="department_input">
          <el-input
            v-model="formData.department_percentage"
            maxlength="5"
            placeholder="请输入"
          />&nbsp;%
        </div>
      </div>
    </el-form-item>
    <span class="department_span">分成比例涉及到结算金额，请认真填写。分成比例累加一定为100%</span>
  </AppFormDialog>
</template>

<style lang="postcss">
.department_span{
  display: block;
  color: #ccc;
  margin-bottom: 20px;
}
.department-form {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  line-height: 40px;
  height: 40px;
}
.department_input{
  width: 30%;
}
.department-form .el-input{
  width: 80%;
}
.department_title{
  width: 45%;
  margin-left: 80px;
}
.department_store{
  margin-bottom: 10px;
}
.department-dialog .el-button{
    display: none;
}
</style>
