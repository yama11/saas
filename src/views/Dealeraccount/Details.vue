<script>
/**
 * @overview 区域运营商结算  - 结算详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'DealerDetails',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {
      data: null,
    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        dealer_name: dealerName,
        decrease_count: decreaseCount,
        decrease_money: decreaseMoney,
        year: Year,
        month: Month,
        status_name: statusName,
        account_time: accountTime,
        payment_method_name: paymentMethodName,
      } = this.data;

      return [
        {
          label: '区域运营商',
          details: dealerName,
        },
        {
          label: '结算月份',
          details: `${Year}年${Month}月`,
        },
        {
          label: '课耗数',
          details: decreaseCount ? decreaseCount.toString() : '0',
        },
        {
          label: '结算金额',
          details: decreaseMoney ? decreaseMoney.toString() : '0',
        },
        {
          label: '付款方式',
          details: paymentMethodName,
        },
        {
          label: '状态',
          details: statusName,
        },
        {
          label: '结算时间',
          details: accountTime,
        },
      ];
    },
  },

  created() {
    this.getDealerInfo();
  },

  methods: {

    getDealerInfo() {
      const url = `/finance/dealer/detail/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    returnHome() {
      return this.$router.push('/account-list');
    },
  },
};
</script>

<template>
  <div class="dealer-info">
    <header class="dealer-info__header">
      <h2 class="dealer-info__title">结算详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="dealer-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          :formttar="note.formttar"
          v-bind="note"
        />
      </section>
      <div
        class="dealer-info-photo"
      >
        <span
          class="dealer-info-photo__span"
        >
          打款凭证
        </span>
        :
        <img
          :src="data.certify"
          class="dealer-info-photo__image"
          alt="">
      </div>
      <div class="dealer-info__but">
        <el-button
          type="primary"
          @click="returnHome"
        >
          确定
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.dealer-info__title{
  padding-left: 1em;

}
.dealer-info__classtime{
  padding-left: 4em;
  padding-bottom:30px;
}
.dealer-info__classtime__week{
  padding-left: 110px;
  margin-top: 10px;
  display: block;
}
.dealer-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.dealer-info-photo{
    padding-left: 62px;
    height: 50px;
    position: relative;
    margin-bottom: 200px;
}
.dealer-info-photo__span{
    height: 55px;
    line-height: 55px;
    text-align: center;
    display: inline-block;
}
.dealer-info-photo .el-form-item__label{
  font-size: 16px;
}
.dealer-info-photo__image{
    width: 366px;
    height: 190px;
    position: absolute;
    left: 145px;
}
.dealer-info__buyer .order-info-note{
    width: 100%;
    margin-bottom: 30px;
  }
.dealer-info__but{
  display: flex;
  justify-content: center;
}
</style>

