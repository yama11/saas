<script>
/**
 * @overview 城市合伙人 - 合伙人列表
 *
 * @author yehaifeng
*/
import list from '@/mixins/list';

export default {

  name: 'PartnerList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'name', label: '合伙人名称' },
        { prop: 'account', label: '账号' },
        { label: '地区',
          formatter: row => `
            ${row.province.name}${row.city.name}${row.district.name}
          `,
        },
        { prop: 'address', label: '详细地址' },
        { prop: 'phone', label: '联系电话' },
        { prop: 'dealers_name', label: '所负责经销商' },
      ],

      list: {},

      visible: false,

      chinaJSON: this.$assets.chinaJSON,

      title: '',

      formData: {
        name: '',
        places: [],
        address: '',
        phone: '',
        account: '',
        password: '',
        dealer_ids: [],
      },

      delaers: [],

      rules: {

        name: [
          this.$rules.required('合伙人名称'),
        ],
        places: [
          this.$rules.required('所在地区', 'array'),
        ],
        address: [
          this.$rules.required('详细地址'),
        ],
        phone: [
          this.$rules.required('联系电话'),
          { ...this.$rules.mobile },
        ],
        dealer_ids: [
          this.$rules.required('所负责经销商', 'array'),
        ],
        account: [
          this.$rules.required('账号'),
        ],
        password: [
          this.$rules.required('密码'),
        ],

      },
    };
  },

  computed: {

    searchArr() {
      const column = [
        { prop: 'name', label: '合伙人名称' },
        { prop: 'account', label: '账号' },
        { prop: 'phone', label: '联系电话' },
      ];
      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },

  },

  methods: {

    indexBefore(id) {
      if (id) {
        this.$http.get(`/partner/store_before?partner_id=${id}`)
          .then((res) => {
            this.delaers = res.delaers;
          });
        return;
      }

      this.$http.get('/partner/store_before?partner_id=0')
        .then((res) => {
          this.delaers = res.delaers;
        });
    },

    checkPermission(key, text) {
      return this.$permissions(`system.partner.${key}`, text);
    },

    toCreatePartner(id, name, phone, address, places, account, dealer_ids) {
      this.visible = true;

      if (id) {
        this.title = '编辑合伙人';
        this.formData = {
          id,
          name,
          phone,
          address,
          places,
          account,
          dealer_ids,
        };
        this.indexBefore(id);
        return;
      }

      this.title = '添加合伙人';
      this.formData = {
        name: '',
        places: [],
        address: '',
        phone: '',
        account: '',
        password: '',
        dealer_ids: [],
      };
      this.indexBefore();
    },

    partnerDelete(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '合伙人',
        '/partner',
        this.$refs.list,
      );
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },


  },
};
</script>

<template>
  <div>
    <AppList
      ref="list"
      :list.sync="list"
      :create-label="checkPermission('store')?'添加合伙人':null"
      api="/partner"
      title="城市合伙人列表"
      @create="toCreatePartner"
    >
      <AppSearch
        v-if="checkPermission('index')"
        slot="search"
        :search-arr="searchArr"
      />
      <template
        v-if="checkPermission('index')"
        slot-scope="props">
        <el-table :data="props.listData">
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :formatter="column.formatter"
          />
          <el-table-column
            label="操作"
            width="150px"
          >
            <template slot-scope="scope">
              <el-button
                v-if="checkPermission('update')"
                size="small"
                @click.native="toCreatePartner(scope.row.id,
                                               scope.row.name,
                                               scope.row.phone,
                                               scope.row.address,scope.row.places,
                                               scope.row.account,scope.row.dealer_ids)"
              >编辑</el-button><el-button
                v-if="checkPermission('delete')"
                size="small"
                type="danger"
                @click.native="partnerDelete(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <AppFormDialog
          :visible.sync="visible"
          :model="formData"
          :object="title"
          :id="formData.id"
          :rules ="rules"
          url="/partner"
          label-width="8em"
          width="650px"
          class="partner-form"
          @on-submit="submitEdition"
        >
          <el-form-item
            label="合伙人名称"
            prop="name"
          >
            <el-input
              v-model="formData.name"
              maxlength="20"
              placeholder="请输入合伙人名称"
            />
          </el-form-item>
          <el-form-item
            label="所在地区"
            prop="places"
          >
            <el-cascader
              :options="chinaJSON"
              v-model="formData.places"
              placeholder="请选择所在地区"
            />
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="address"
          >
            <el-input
              v-model="formData.address"
              placeholder="请输入详细地址"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="phone"
          >
            <el-input
              v-model="formData.phone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item
            label="所负责经销商"
            prop="dealer_ids"
          >
            <el-select
              v-model="formData.dealer_ids"
              multiple
              filterable
              placeholder="请选择所负责经销商"
            >
              <el-option
                v-for="item in delaers"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="账号"
            prop="account"
          >
            <el-input
              v-model="formData.account"
              placeholder="请输入账号"
            />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
        </AppFormDialog>
      </template>
    </AppList>
  </div>
</template>

<style>
.partner-form .el-cascader,.partner-form .el-select{
  width: 100%;
}
</style>

