<script>
/**
 * @overview 用户提现  - 提现处理
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'DrawDispose',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      url: '/finance/draw_money/upload',
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

    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }
      const prefix = this.$route.path.match(/^\/\w+-/)[0];
      const location = (prefix && prefix.concat('list')) || '/';
      return this.$router.push(location);
    },

    returnAudit() {
      this.$http.patch(`/finance/draw_money/success/${this.$route.params.id}`, { certificate: this.data.certificate })
        .then(this.cancelForm());
    },

    returnCancel() {
      this.$http.patch(`/finance/draw_money/fail/${this.$route.params.id}`)
        .then(this.cancelForm());
    },

    handleAvatarSuccess({ head_url }) {
      this.data.certificate = head_url;
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
  <div class="draw-deal">
    <header class="draw-deal__header">
      <h2 class="draw-deal__title">打款处理</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="draw-deal__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          :label ="note.label"
        />
      </section>
      <div
        class="draw-deal__voucher">
        <span>打款凭证</span>
        &nbsp;:&nbsp;&nbsp;
        <el-upload
          :show-file-list="false"
          v-model="data.certificate"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="uploadError"
          :headers="uploadHeaders"
          :action="uploadURL"
          name="head_url"
          class="draw-deal__voucher__uploader">
          <img
            v-if="data.certificate"
            :src="data.certificate"
            class="draw-deal__image">
          <i
            v-else
            class="el-icon-plus draw-deal__voucher__uploader-icon"/>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            只能上传jpg/png/bmp文件，且不超过2MB
          </div>
        </el-upload>
      </div>
      <div class="draw-deal__but">
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
.draw-deal__title{
  padding-left: 1em;

}
.draw-deal__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.draw-deal__voucher{
  display:flex;
  padding-left: 62px;
  margin-bottom: 30px;
}
.draw-deal__voucher .el-form-item{
  display: inline-block;
}
.draw-deal__buyer .order-info-note{
    width: 100%;
    margin-bottom: 30px;
  }
.draw-deal__but{
  display: flex;
  justify-content: center;
}
.draw-deal__voucher__uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.draw-deal__voucher__uploader .el-upload:hover {
    border-color: #409EFF;
  }
.draw-deal__voucher__uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
.draw-deal__image {
    width: 366px;
    height: 190px;
    display: block;
  }
</style>

