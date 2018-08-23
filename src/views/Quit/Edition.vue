<script>
export default{

  name: 'QuitEdition',

  props: {
    id: {
      type: Number,
      default: null,
    },

    visible: {
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
    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },
  },

};
</script>
<template>
  <AppFormDialog
    :visible="visible"
    :model="formData"
    url="/quit"
    object="退班"
    label-width="8em"
    class="process-edition"
    width="550px"
    @on-submit="submitEdition"
    @update:visible="value => $emit('update:visible', value)"
  >
    <el-form-item
      label="课程名称"
      prop="curriculum_name"
    >
      <span>{{ formData.curriculum_name }}</span>
    </el-form-item>
    <el-form-item
      label="单价"
      prop="price"
    >
      <span>{{ formData.price }}</span>
    </el-form-item>
    <el-form-item
      label="扣课折扣"
      prop="refund_rate"
    >
      <span>{{ formData.refund_rate }}</span>
    </el-form-item>
    <el-form-item
      label="总课时"
      prop="hour_total"
    >
      <span>{{ formData.hour_total }}</span>
    </el-form-item>
    <el-form-item
      label="实付金额"
      prop="paid"
    >
      <span>{{ formData.paid }}</span>
    </el-form-item>
    <el-form-item
      label="已耗课时"
      prop="hour_finish"
    >
      <span>{{ formData.hour_finish }}</span>
    </el-form-item>
    <el-form-item
      label="原订单优惠金额"
      prop="discount"
    >
      <span>{{ formData.discount }}</span>
    </el-form-item>
    <el-form-item
      label="退费金额"
      prop="refund_money"
    >
      <span>{{ formData.refund_money }}</span>
    </el-form-item>
  </AppFormDialog>
</template>

