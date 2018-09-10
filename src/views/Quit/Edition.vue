<script>
/**
 * @overview 退班管理 - 退班列表 - 退班弹框
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';

export default{

  name: 'QuitEdition',

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

    // 编辑数据
    formData: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      rules: {
        curriculum_name: [
          this.$rules.required('课程名称'),
        ],
        price: [
          this.$rules.required('单价'),
        ],
        refund_rate: [
          this.$rules.required('扣课折扣'),
        ],
        hour_total: [
          this.$rules.required('总课时', 'number'),
        ],
        paid_money: [
          this.$rules.required('实付金额'),
        ],
        hour_finish: [
          this.$rules.required('已耗课时', 'number'),
        ],
        discount: [
          this.$rules.required('原订单优惠金额', 'number'),
        ],
        refund_money: [
          this.$rules.required('退费金额', 'number'),
        ],
      },
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
    :rules ="rules"
    url="/quit"
    object="退班"
    label-width="9em"
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
      prop="paid_money"
    >
      <span>{{ formData.paid_money }}</span>
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

