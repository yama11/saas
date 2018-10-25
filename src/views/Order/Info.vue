<script>
/**
 * @overview 商品中心 - 订单管理 - 订单详情
 *
 * @author suyanping
 */

import { form } from '@/mixins';
import InfoNote from './../components/InfoNote';

export default {
  name: 'OrderInfo',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {
      id: this.$route.params.id,

      data: {},

      columns: [
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'curriculum_category_name', label: '品类' },
        { prop: 'curriculum_course_number', label: '课时数' },
        { prop: 'curriculum_price', label: '课时单价' },
        { prop: 'curriculum_refund_rate', label: '扣课折扣' },
        { prop: 'original_price', label: '课程金额' },
      ],

      listData: [],

    };
  },

  computed: {
    roleShow() {
      const roleType = this.$store.state.roleType;

      return roleType === 31;
    },

    buyer() {
      const {
        student_name: studentName,
        client_phone: clientPhone,
      } = this.data;

      return [
        {
          label: '小孩姓名',
          content: studentName,
        },
        {
          label: '手机号码',
          content: clientPhone,
        },
      ];
    },

    order() {
      const initOrder = {
        merchandiseName: this.data.merchandise_name,
        orderNumber: this.data.order_sn,
        statusName: this.data.status_name,
        orderTime: this.data.order_time,
        originalPrice: this.data.original_price,
        paidTime: this.data.paid_time,
        discountMoney: this.data.discount_money,
        payTypeName: this.data.pay_type_name,
        paidMoney: this.data.paid_money,
      };

      const showOrder = this.roleShow
        ? {
          ...initOrder,
          departmentName: this.data.department_name,
        }
        : { ...initOrder };

      const orderList = [
        {
          label: '商品名称',
          content: showOrder.merchandiseName,
        },
        {
          label: '订单编号',
          content: showOrder.orderNumber,
        },
        {
          label: '订单状态',
          content: showOrder.statusName,
        },
        {
          label: '下单时间',
          content: showOrder.orderTime,
        },
        {
          label: '商品金额',
          content: showOrder.originalPrice
            ? `￥${showOrder.originalPrice}`
            : '',
        },
        {
          label: '付款时间',
          content: showOrder.paidTime || '',
        },
        {
          label: '优惠金额',
          content: showOrder.discountMoney
            ? `￥${showOrder.discountMoney}`
            : '',
        },
        {
          label: '支付方式',
          content: showOrder.payTypeName,
        },
        {
          label: '实付金额',
          content: showOrder.paidMoney
            ? `￥${showOrder.paidMoney}`
            : '',
        },
      ];

      return this.roleShow
        ? [
          ...orderList,
          {
            label: '所属机构',
            content: showOrder.departmentName,
          },
        ]
        : [...orderList];
    },

  },

  created() {
    this.getOrderInfo();
  },

  beforeRouterEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line
      vm.from = from;
    });
  },

  methods: {
    getOrderInfo() {
      this.$http.get(`/order/${this.id}`)
        .then((res) => {
          this.data = res;

          this.listData = res.order_curriculum;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

  },
};
</script>

<template>
  <div class="order-info">
    <header class="order-info__header">
      <h2 class="order-info__title">订单详情</h2>
    </header>

    <div
      v-if="data"
      class="order-info__body"
    >

      <div
        v-if="!roleShow"
        class="order-info__section-header">
        买家信息
      </div>

      <section
        v-if="!roleShow"
        class="order-info__buyer"
      >
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          v-bind="note"
        />
      </section>

      <div class="order-info__section-header">
        订单详情
      </div>

      <section
        class="order-info__order"
      >
        <InfoNote
          v-for="note in order"
          :key="note.label"
          v-bind="note"
        />
      </section>

      <div class="order-info__section-header">
        课程信息
      </div>

      <el-table
        :data="listData"
        border
        class="order-info__table"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
        />
      </el-table>

    </div>
  </div>
</template>

<style lang="postcss">
.order-info {
  display: flex;
  flex-direction: column;
  padding: 0 2em;
}

.order-info__header {
  display: flex;
  align-items: center;
  padding: 1em 0;
}

.order-info__title {
  font-size: 1.2rem;
}

.order-info__body {
  min-width: 350px;
  max-width: 960px;
  line-height: 1.5;
}

.order-info__section-header {
  background-color: #FEECEC;
  font-size: 1.1em;
  padding: 0.2em;
  margin-top: 1em;
}

.order-info__section-header:first-child {
  margin-top: 0;
}

.order-info__buyer,
.order-info__order {
  display: flex;
  flex-wrap: wrap;
}

.order-info__buyer .order-info-note,
.order-info__order .order-info-note {
  margin: .5em 0;
  width: 40%;
}

.order-info__table{
  margin-top: 10px;
}

</style>
