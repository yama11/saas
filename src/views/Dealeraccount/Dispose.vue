<script>
/**
 * @overview 经销商结算  - 结算处理
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'DealerDispose',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      url: '/finance/dealer/upload',
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
      } = this.data;

      return [
        {
          label: '经销商',
          details: dealerName,
        },
        {
          label: '结算月份',
          details: `${Year}年${Month}月`,
        },
        {
          label: '课耗数',
          details: decreaseCount ? decreaseCount.toString() : '',
        },
        {
          label: '结算金额',
          details: decreaseMoney ? decreaseMoney.toString() : '',
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
    uploadURL() {
      const productionURL = this.$http.baseURI + this.url;

      return productionURL;
    },

    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
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

    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }
      const prefix = this.$route.path.match(/^\/\w+-/)[0];
      const location = (prefix && prefix.concat('list')) || '/';
      return this.$router.push(location);
    },

    returnAudit() {
      this.$http.patch(`/finance/dealer/accounted/${this.$route.params.id}`, { certify: this.data.certify })
        .then(this.cancelForm)
        .cantch((err) => {
          this.$message.error(err.message);
        });
    },

    returnCancel() {
      this.$router.push('/account-list');
    },

    handleAvatarSuccess({ head_url }) {
      this.data.certify = head_url;
    },

    beforeAvatarUpload(file) {
      const pattern = /^image\/(jpe?g|png|JPE?G|PNG)$/;
      const isPicture = pattern.test(file.type);
      const isLt2M = file.size / 1024 / 1024 <= 2;

      // 限制上传图片类型
      if (!isPicture) {
        this.$message.error('上传图片图片只能是 JPG、JPEG、PNG 格式!');
      }

      // 限制上传照片大小
      if (!isLt2M) {
        this.$message.error('上传图片图片大小不能超过 2MB!');
      }

      return isPicture && isLt2M;
    },

    // 图片上传失败事件
    uploadError(errors) {
      const message = JSON.parse(errors.message);

      this.$message.error(message || '图片上传失败!');
    },
  },
};
</script>

<template>
  <div class="dealer-deal">
    <header class="dealer-deal__header">
      <h2 class="dealer-deal__title">结算处理</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="dealer-deal__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          :label ="note.label"
        />
      </section>
      <div
        class="dealer-deal__voucher">
        <span>打款凭证</span>
        &nbsp;:&nbsp;&nbsp;
        <el-upload
          :show-file-list="false"
          v-model="data.certify"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="uploadError"
          :headers="uploadHeaders"
          :action="uploadURL"
          name="head_url"
          class="dealer-deal__voucher__uploader">
          <img
            v-if="data.certify"
            :src="data.certify"
            class="dealer-deal__image">
          <i
            v-else
            class="el-icon-plus dealer-deal__voucher__uploader-icon"/>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            只能上传jpg/png/bmp文件，且不超过2MB
          </div>
        </el-upload>
      </div>
      <div class="dealer-deal__but">
        <el-button
          type="primary"
          @click="returnAudit"
        >
          确定打款
        </el-button>
        <el-button
          type="primary"
          @click="returnCancel"
        >
          取消打款
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.dealer-deal__title{
  padding-left: 1em;
}
.dealer-deal__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.dealer-deal__voucher{
  display:flex;
  padding-left: 62px;
  margin-bottom: 30px;
}
.dealer-deal__voucher .el-form-item{
  display: inline-block;
}
.dealer-deal__buyer .order-info-note{
    width: 100%;
    margin-bottom: 30px;
  }
.dealer-deal__but{
  display: flex;
  justify-content: center;
}
.dealer-deal__voucher__uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.dealer-deal__voucher__uploader .el-upload:hover {
    border-color: #409EFF;
  }
.dealer-deal__voucher__uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
.dealer-deal__image {
    width: 366px;
    height: 190px;
    display: block;
  }
</style>

