<script>
/**
 * @overview 系统中心 - 直播室管理
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';

export default {
  name: 'LiveroomList',

  mixins: [list],

  data() {
    return ({
      list: {
        data: [],
      },

      columns: [
        {
          prop: 'name',
          label: '直播室名称',
        },
        {
          prop: 'account',
          label: '直播室账号',
        },
        {
          prop: 'created_at',
          label: '创建时间',
        },
      ],

      formInit: {
        name: '',
        account: '',
        possword: '',
      },

      formData: { ...this.formInit },

      dialogVisible: false,

      rules: {
        name: [
          this.$rules.required('直播室名称'),
          { max: 10, message: '长度10个字符以内', trigger: 'blur' },
        ],

        account: [
          this.$rules.required('直播室账号'),
          { max: 10, message: '长度10个字符以内', trigger: 'blur' },
        ],

        password: [
          ...this.$rules.password(),
        ],
      },

      editTargetID: undefined,
    });
  },

  methods: {
    liveroomDelete(id) {
      this.$_listMixin_alertDeleteItem(
        id, this.list.data, '直播室', '/liveroom',
      );
    },

    liveroomPreEdit(data) {
      this.editTargetID = data && data.id;

      this.formData = {
        ...this.formInit,
        ...(data || {}),
      };

      this.dialogVisible = true;
    },

    liveroomEdit(submit) {
      submit()
        .then(this.$refs.list.getList);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/liveroom"
    title="直播室管理"
    create-label="添加直播间"
    class="liveroomList"
    @create="liveroomPreEdit"
  >
    <el-table :data="list.data" >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      />

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            size="small"
            @click="liveroomPreEdit(row)"
          >
            编辑
          </el-button>

          <el-button
            size="small"
            type="danger"
            @click="liveroomDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <AppFormDialog
      :model="formData"
      :rules="rules"
      :id="editTargetID"
      :visible.sync="dialogVisible"
      :object="editTargetID ? '编辑直播间' : '添加直播间'"
      label-width="7em"
      width="500px"
      url="/liveroom"
      @on-submit="liveroomEdit"
    >
      <el-form-item
        prop="name"
        label="直播室名称"
      >
        <el-input v-model="formData.name"/>
      </el-form-item>
      <el-form-item
        prop="account"
        label="直播室账号"
      >
        <el-input v-model="formData.account"/>
      </el-form-item>
      <el-form-item
        prop="password"
        label="直播室密码"
      >
        <el-input v-model="formData.password"/>
      </el-form-item>
    </AppFormDialog>
  </AppList>
</template>

<style lang="postcss">
.liverooom {

}
</style>
