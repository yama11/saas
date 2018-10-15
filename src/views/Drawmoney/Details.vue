<script>
/**
 * @overview 用户提现  - 提现详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'DrawDetails',

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
        client_phone: clientPhone,
        money: Money,
        draw_time: drawTime,
        draw_status_name: drawStatusName,
        bank: Bank,
        card_user: cardUser,
        card_number: cardNumber,
      } = this.data;

      return [
        {
          label: '提现用户',
          details: clientPhone,
        },
        {
          label: '提现金额',
          details: Money,
        },
        {
          label: '提现时间',
          details: drawTime,
        },
        {
          label: '状态',
          details: drawStatusName,
        },
        {
          label: '收款银行',
          details: Bank,
        },
        {
          label: '收款人',
          details: cardUser,
        },
        {
          label: '收款账户',
          details: cardNumber,
        },
      ];
    },
  },

  created() {
    this.getDrawInfo();
  },

  methods: {

    getDrawInfo() {
      const url = `/finance/draw_money/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    returnHome() {
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
  <div class="draw-info">
    <header class="draw-info__header">
      <h2 class="draw-info__title">提现详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="draw-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          v-bind="note"
        />
      </section>
      <div
        class="draw-info-photo"
      >
        <span
          class="draw-info-photo__span"
        >
          打款凭证
        </span>
        :
        <img
          :src="data.certificate"
          class="draw-info-photo__image"
          alt="">
      </div>
      <div class="draw-info__but">
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
.draw-info__title{
  padding-left: 1em;

}
.draw-info__classtime{
  padding-left: 4em;
  padding-bottom:30px;
}
.draw-info__classtime__week{
  padding-left: 110px;
  margin-top: 10px;
  display: block;
}
.draw-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.draw-info-photo{
    padding-left: 62px;
    height: 50px;
    position: relative;
    margin-bottom: 200px;
}
.draw-info-photo__span{
    height: 55px;
    line-height: 55px;
    text-align: center;
    display: inline-block;
}
.draw-info-photo .el-form-item__label{
  font-size: 16px;
}
.draw-info-photo__image{
    width: 366px;
    height: 190px;
    position: absolute;
    left: 145px;
}
.draw-info__buyer .order-info-note{
    width: 100%;
    margin-bottom: 30px;
  }
.draw-info__but{
  display: flex;
  justify-content: center;
}
</style>

