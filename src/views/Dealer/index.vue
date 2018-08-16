<script>
/**
 * @overview 经销商管理  - 经销商列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'DealerList',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'name', label: '经销商名称' },
        { prop: 'account', label: '管理员账号' },
        { label: '地区',
          formatter: row => `
            ${row.province.name}${row.city.name}${row.district.name}
          `,
        },
        { prop: 'address', label: '详细地址' },
        { prop: 'phone', label: '联系电话' },
      ],

      list: {},

      visible: false,

      title: '',

      chinaJSON: this.$assets.chinaJSON,

      formData: {
        name: '',
        places: [],
        address: '',
        phone: '',
        account: '',
        password: '',
      },

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '经销商名称' },
        { prop: 'account', label: '管理员账号' },
        { prop: 'phone', label: '联系电话' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {

    editDealer(id, name, places, address, phone, account, password) {
      this.visible = true;

      if (id) {
        this.title = '编辑机构';
        this.formData = {
          id,
          name,
          places,
          address,
          phone,
          account,
          password,
        };
      } else {
        this.title = '新增机构';
        this.formData = {};
      }
    },

    deleteDealer(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '经销商', '/dealer');
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="添加机构"
    api="/dealer"
    title="经销商管理"
    @create="editDealer"
  >
    <AppSearch
      slot="search"
      :search-arr="searchArr"
    />
    <template slot-scope="props">
      <el-table
        :data="props.listData"
      >
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editDealer(scope.row.id,scope.row.name,
                                 scope.row.places,scope.row.address,
                                 scope.row.phone,scope.row.account,scope.row.password)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteDealer(scope.row.id)"
            >
              删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <AppFormDialog
        :visible.sync="visible"
        :model="formData"
        :object="title"
        :id="formData.id"
        url="/dealer"
        label-width="5em"
        width="500px"
        @on-submit="submitEdition"
      >
        <el-form-item
          label="经销商名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            maxlength="20"
            placeholder="请输入经销商名称"
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
          label="管理员账号"
          prop="account"
        >
          <el-input
            v-model="formData.account"
            placeholder="请输入管理员账号"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </AppFormDialog>
    </template>
  </AppList>
</template>
