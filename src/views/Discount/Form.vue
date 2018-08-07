<script>
/**
 * @desc 创建和编辑优惠券
 *
 * @author suyanping
*/
import { form } from '@/mixins';
import { times } from '@/utils';
import AddressMulti from './../components/AddressMulti';

export default {
  name: 'DiscountForm',

  components: {
    AddressMulti,
  },

  mixins: [form],

  data() {
    return {
      id: this.$route.params.id,

      pickerTime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },

      discountForm: {
        name: '',
        type: 1,
        discount_money: null,
        discount_rate: null,
        give_class_hour: null,
        administrative_division_code: [],
        total_quantity: null,
        condition: 1,
        validityDate: '',
        distribute_effect_time: null,
        distribute_expire_time: null,
        minimum_price: null,
        expire_type: 1,
        useDate: '',
        expire_effect_time: null,
        expire_expire_time: null,
        expire_day: null,
        coupon_applicable: {
          'App\\Models\\Merchandise': [],
          'App\\Models\\Curriculum': [],
        },
        can_superposition: 0,
        rule_description: '',
      },

      rules: {
        name: [
          this.$rules.required('优惠券名称'),
        ],

        discount_money: [
          this.$rules.required('优惠券面值金额'),
          { ...this.$rules.prices },
        ],

        discount_rate: [
          this.$rules.required('折扣优惠'),
          { ...this.$rules.discount },
        ],

        administrative_division_code: [
          this.$rules.required('优惠地域', 'array'),
        ],

        give_class_hour: [
          this.$rules.required('课时数'),
          { ...this.$rules.numbers },
        ],

        total_quantity: [
          { ...this.$rules.numbers },
        ],

        minimum_price: [
          { ...this.$rules.prices },
        ],

        validityDate: [
          this.$rules.required('领取有效期', 'array'),
        ],

        useDate: [
          this.$rules.required('使用有效期', 'array'),
        ],

        expire_day: [
          this.$rules.required('使用有效期'),
          { ...this.$rules.numbers },
        ],
      },

      formBefore: {
        couponType: [],
        couponCondition: [],
        couponExpireType: [],
        couponCanSuperposition: [],
        curriculum: [],
        merchandise: [],
      },

      division: [],

      addressTags: [],

    };
  },

  created() {
    this.getCreateBefore();

    if (this.id) {
      this.getDiscountData();
    }
  },

  methods: {
    getCreateBefore() {
      this.$http.get('/coupon/create_before')
        .then((res) => {
          this.formBefore.couponType = res.coupon_type;

          this.formBefore.couponCondition = res.coupon_condition;

          this.formBefore.couponExpireType = res.coupon_expire_type;

          this.formBefore.couponCanSuperposition = res.coupon_can_superposition;
        });
    },

    getDiscountData() {
      this.$http.get(`/coupon/${this.id}`)
        .then((res) => {
          this.discountForm = {
            ...res,
            validityDate: '',
            useDate: '',
          };

          this.division = res.coupon_administrative_division
            .map(item => item.administrative_division_code);

          this.addressTags = res.coupon_administrative_division
            .map(item => ({
              name: item.administrative_division_full_name,
              value: item.administrative_division_code,
            }));

          this.discountForm.administrative_division_code =
           res.coupon_administrative_division
             .map(item => item.administrative_division_code);

          if (res.condition !== 3) {
            this.discountForm.validityDate =
            [new Date(res.distribute_effect_time), new Date(res.distribute_expire_time)];
          }

          if (res.expire_type === 1) {
            this.discountForm.useDate =
            [new Date(res.expire_effect_time), new Date(res.expire_expire_time)];
          }
        });
    },

    getDivisionCode(value) {
      this.discountForm.administrative_division_code = value;
    },

    submitForm(submit) {
      if (this.discountForm.validityDate) {
        this.discountForm.distribute_effect_time =
        times.dateChange(this.discountForm.validityDate[0], 'zero');

        this.discountForm.distribute_expire_time =
        times.dateChange(this.discountForm.validityDate[1], 'full');
      }

      if (this.discountForm.useDate) {
        this.discountForm.expire_effect_time =
        times.dateChange(this.discountForm.useDate[0], 'zero');

        this.discountForm.expire_expire_time =
        times.dateChange(this.discountForm.useDate[1], 'full');
      }

      submit();
    },

    resetFormType(discountForm) {
      this.discountForm.discount_money = null;
      this.discountForm.discount_rate = null;
      this.discountForm.give_class_hour = null;

      this.discountForm.coupon_applicable = {
        'App\\Models\\Merchandise': [],
        'App\\Models\\Curriculum': [],
      };

      this.$refs[discountForm].clearValidate(['discount_money', 'discount_rate', 'give_class_hour']);
    },

    resetFormCondition(discountForm) {
      this.discountForm.validityDate = '';

      this.discountForm.distribute_effect_time = null;
      this.discountForm.distribute_expire_time = null;

      this.$refs[discountForm].clearValidate(['validityDate']);
    },

    resetFormUse(discountForm) {
      this.discountForm.useDate = '';
      this.discountForm.expire_day = null;

      this.discountForm.expire_effect_time = null;
      this.discountForm.expire_expire_time = null;

      this.$refs[discountForm].clearValidate(['useDate', 'expire_day']);
    },

  },
};
</script>

<template>
  <AppFormPage
    ref="discountForm"
    :model="discountForm"
    :rules="rules"
    :from="from"
    :object="id ? '编辑优惠券' : '添加优惠券'"
    url="/coupon"
    class="discount-form"
    label-width="100px"
    @on-submit="submitForm"
  >
    <el-form-item
      label="优惠券名称"
      prop="name"
    >
      <el-input
        v-model="discountForm.name"
        maxlength="20"
        placeholder="请输入优惠券名称"
        style="width:400px;"
      />
    </el-form-item>

    <el-form-item
      label="优惠券类别"
      prop="type"
    >
      <el-radio-group v-model="discountForm.type">
        <el-radio
          v-for="item in formBefore.couponType"
          :key="item.value"
          :label="item.value"
          @change="resetFormType('discountForm')">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="discountForm.type === 1"
      label=" "
      prop="discount_money"
    >
      <el-input
        v-model="discountForm.discount_money"
        placeholder="请输入优惠券面值金额"
        style="width:200px;"
      /> 元
    </el-form-item>

    <el-form-item
      v-else-if="discountForm.type === 2"
      label=" "
      prop="discount_rate"
    >
      <el-input
        v-model="discountForm.discount_rate"
        placeholder="请输入0~1间折扣数值"
        style="width:200px;"
      /> 折
    </el-form-item>

    <el-form-item
      v-else
      label=" "
      prop="give_class_hour"
    >
      <el-input
        v-model="discountForm.give_class_hour"
        placeholder="请输入赠送课时数"
        style="width:200px;"
      />
    </el-form-item>

    <el-form-item
      label="优惠地域"
      prop="administrative_division_code"
    >
      <AddressMulti
        :division="division"
        :address-tags="addressTags"
        @divisionCode="getDivisionCode"/>

    </el-form-item>

    <el-form-item
      label="总发放数量"
      prop="total_quantity"
    >
      <el-input
        v-model="discountForm.total_quantity"
        placeholder="请输入优惠券总发放数量"
        style="width:400px;"
      />
    </el-form-item>

    <div>领取方式</div>
    <hr>

    <el-form-item
      label="领取条件"
      prop="condition"
    >
      <el-radio-group v-model="discountForm.condition">
        <el-radio
          v-for="item in formBefore.couponCondition"
          :key="item.value"
          :label="item.value"
          @change="resetFormCondition('discountForm')">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="discountForm.condition !== 3"
      label="领取有效期"
      prop="validityDate"
    >
      <el-date-picker
        v-model="discountForm.validityDate"
        :picker-options="pickerTime"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:400px;"/>
    </el-form-item>

    <div>使用方式</div>
    <hr>

    <el-form-item
      label="消费最低金额"
      prop="minimum_price"
    >
      <el-input
        v-model="discountForm.minimum_price"
        placeholder="请输入最低消费金额"
        style="width:200px;"
      />
      <span style="color:darkgray;">空时为不限金额</span>
    </el-form-item>

    <el-form-item
      label="使用有效期"
      prop="expire_type"
    >
      <el-radio-group v-model="discountForm.expire_type">
        <el-radio
          v-for="item in formBefore.couponExpireType"
          :key="item.value"
          :label="item.value"
          @change="resetFormUse('discountForm')">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="discountForm.expire_type === 1"
      label=" "
      prop="useDate"
    >
      <el-date-picker
        v-model="discountForm.useDate"
        :picker-options="pickerTime"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:400px;"/>
    </el-form-item>

    <el-form-item
      v-else
      label=" "
      prop="expire_day"
    >
      <el-input
        v-model="discountForm.expire_day"
        placeholder="请输入有效天数"
        style="width:400px;"
      />
    </el-form-item>

    <el-form-item
      v-if="discountForm.type !== 3"
      label="可使用商品"
      prop="Merchandise"
    >
      <el-select
        v-model="discountForm.coupon_applicable['App\\Models\\Merchandise']"
        multiple
        placeholder="请选择可使用商品"
        style="width:400px;">
        <el-option
          v-for="item in formBefore.merchandise"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
    </el-form-item>

    <el-form-item
      v-else
      label="可使用课程"
      prop="Category"
    >
      <el-select
        v-model="discountForm.coupon_applicable['App\\Models\\Curriculum']"
        multiple
        placeholder="请选择可使用课程"
        style="width:400px;">
        <el-option
          v-for="item in formBefore.curriculum"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
    </el-form-item>

    <el-form-item
      label="是否叠加使用"
      prop="can_superposition"
    >
      <el-radio-group v-model="discountForm.can_superposition">
        <el-radio
          v-for="item in formBefore.couponCanSuperposition"
          :key="item.value"
          :label="item.value">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="使用规则"
      prop="rule_description"
    >
      <el-input
        :rows="6"
        v-model="discountForm.rule_description"
        type="textarea"
        placeholder="请输入内容"/>
    </el-form-item>

  </AppFormPage>
</template>

<style lang="postcss">

</style>