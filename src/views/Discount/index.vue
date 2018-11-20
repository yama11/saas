<script>
/**
 * @overview 商品中心 - 优惠券管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import { times, token } from '@/utils';
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'DiscountList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'name', label: '优惠券名称' },
        { prop: 'type_name', label: '优惠类别' },

        { label: '优惠区域',
          formatter: (row) => {
            const division = row.coupon_administrative_division;
            if (division.length > 1) {
              return `${division[0].administrative_division_full_name}...`;
            }

            if (division.length === 1) {
              return `${division[0].administrative_division_full_name}`;
            }

            return '';
          } },

        { prop: 'condition_name', label: '领取条件' },

        { label: '领取有效期',
          formatter: (row) => {
            if (row.condition !== 3) {
              return `${times.dateChange(row.distribute_effect_time)}至${times.dateChange(row.distribute_expire_time)}`;
            }
            return '';
          } },

        { label: '领取/总发放数量',
          formatter: (row) => {
            const distributed = row.distributed_quantity ? row.distributed_quantity : 0;
            const total = row.total_quantity ? row.total_quantity : 0;

            return `${distributed}/${total}`;
          } },

        { prop: 'minimum_price', label: '消费最低金额' },

        { label: '使用有效期',
          formatter: (row) => {
            if (row.expire_type === 1) {
              return `${times.dateChange(row.expire_effect_time)}至${times.dateChange(row.expire_expire_time)}`;
            }
            return `领取后${row.expire_day}天有效`;
          } },

        { prop: 'created_at', label: '创建时间' },
      ],

      codeType: '',

      codeId: null,

      codeForm: {
        content: '',
        size: 48,
        color: '#000000',
        background_color: '#FFFFFF',
        merge: '',
      },

      size: 48,

      codeVal: 'URL=',

      visible: false,
    };
  },

  computed: {
    searchArr() {
      const column = [{ prop: 'name', label: '优惠券名称' }];

      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },

    widthCss() {
      return this.size > 180
        ? `${this.size + 450}px`
        : '600px';
    },

  },

  created() {
    this.getCodeType();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`shop.coupon.${key}`, text);
    },

    getCodeType() {
      this.$http.get('/qr_code/store_before')
        .then(({ instance_type }) => {
          const type = instance_type.find(item => item.name === '优惠券');

          this.codeType = type.value;
        });
    },

    createDiscount() {
      this.$router.push('/discount-create');
    },

    lookDiscount(id) {
      this.$router.push(`/discount-look/${id}_${id}`);
    },

    editDiscount(id) {
      this.$router.push(`/discount-edit/${id}`);
    },

    discountShelve(id) {
      this.$http.post(`/coupon/${id}/shelve`)
        .then(() => this.$refs.list.getList());
    },

    discountOffShelve(id) {
      this.$http.post(`/coupon/${id}/off_shelve`)
        .then(() => this.$refs.list.getList());
    },

    discountSituation(id) {
      this.$router.push(`/discount-get/${id}`);
    },

    createCode(id, url) {
      this.visible = true;

      this.codeId = id;

      const data = {
        instance_type: this.codeType,
        instance_id: this.codeId,
      };

      const query = Object.keys(data)
        .map(key => `${key}=${data[key]}`)
        .join('&');

      this.$http.get(`/qr_code/find?${query}`)
        .then((res) => {
          this.codeVal += url;

          const isArr = res instanceof Array;

          this.codeForm = isArr
            ? {
              ...this.codeForm,
              content: url,
            }
            : { ...res };

          this.$nextTick(() => {
            this.$refs.appCode.changeCode();
          });
        })
        .catch((error) => {
          this.errorAlert(error);
        });
    },

    clearModal() {
      this.visible = false;

      this.codeVal = 'URL=';

      this.codeId = null;

      this.codeForm = {
        content: '',
        size: 48,
        color: '#000000',
        background_color: '#FFFFFF',
        merge: '',
      };
    },

    getLogo(merge) {
      this.codeForm = {
        ...this.codeForm,
        merge,
      };
    },

    getSize(size) {
      this.size = size;
    },

    makerCode(upload) {
      const data = {
        ...this.codeForm,
        instance_type: this.codeType,
        instance_id: this.codeId,
      };

      this.$http.post('/qr_code', data)
        .then(() => {
          if (upload === 'upload') {
            this.getQRCode();
          }

          this.clearModal();
        })
        .catch((error) => {
          this.errorAlert(error);
        });
    },

    getQRCode() {
      const tokens = token.get();

      const query = (Object.keys(this.codeForm)
        .map(key => `${key}=${this.codeForm[key]}`)
        .join('&'));

      // eslint-disable-next-line
      const url = query.replace(/\#/g, '%23');

      const codeUrl = `${this.$http.baseURI}/qr_code/generate?${url}&token=${tokens}`;

      const codeLink = document.createElement('a');
      codeLink.setAttribute('href', codeUrl);
      codeLink.setAttribute('download', 'code.png');
      codeLink.click();
    },

    deleteDiscount(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '优惠券',
        '/coupon',
        this.$refs.list,
      );
    },

    errorAlert(error) {
      const errorMessage = errorHandler(error);

      this.$message.error(errorMessage[0]);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store', '添加优惠券')"
    class="discount-list"
    api="/coupon"
    title="优惠券管理"
    @create="createDiscount()"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"/>

    <template
      v-if="checkPermission('index')"
      slot-scope="{ listData }">

      <el-table
        :data="listData"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />

        <el-table-column
          label="操作"
          width="520px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 3 && checkPermission('shelve')"
              size="small"
              @click="discountShelve(scope.row.id)"
            >
              上架
            </el-button>

            <el-button
              v-if="scope.row.status === 2 && checkPermission('off_shelve')"
              size="small"
              @click="discountOffShelve(scope.row.id)"
            >
              下架
            </el-button>

            <el-button
              v-if="$permissions('shop.client_coupon')"
              size="small"
              @click="discountSituation(scope.row.id)"
            >
              领取情况
            </el-button>

            <el-button
              v-if="checkPermission('generate_qr_code')
              && scope.row.condition === 3"
              size="small"
              @click="createCode(scope.row.id,scope.row.draw_url)"
            >
              生成发放二维码
            </el-button>

            <el-button
              v-if="checkPermission('show')"
              size="small"
              type="primary"
              @click="lookDiscount(scope.row.id)"
            >
              查看
            </el-button>

            <el-button
              v-if="scope.row.can_edit && checkPermission('update')"
              size="small"
              @click="editDiscount(scope.row.id)"
            >
              编辑
            </el-button>

            <el-button
              v-if="scope.row.can_delete && checkPermission('delete')"
              size="small"
              type="danger"
              @click="deleteDiscount(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog
        :visible="visible"
        :close-on-click-modal="false"
        :width="widthCss"
        title="生成发放二维码"
        class="discount-list__modal"
        @close="clearModal">

        <hr>

        <AppQRCode
          ref="appCode"
          :code-form="codeForm"
          :size="size"
          :code-val="codeVal"
          @sendLogo="getLogo"
          @sendSize="getSize"
          @buildCode="makerCode"/>

      </el-dialog>

    </template>
  </AppList>
</template>

<style lang="postcss">
.discount-list__modal .el-dialog__body {
  padding-top: 0px;
}
</style>
