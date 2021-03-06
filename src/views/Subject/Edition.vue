<script>
/**
 * @overview 学科管理 - 学科结构编辑
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';
import AppTextArea from './../../components/AppTextArea';

export default {
  name: 'SubjectEdition',

  components: {
    AppTextArea,
  },

  mixins: [list],

  data: () => ({
    subject: {
      name: '',
      id: 0,
    },

    data: [],

    list: {},

    dialogVisible: false,

    formData: {
      name: '',
      subject_id: 0,
      parent_id: 0,
      describe: '',
      introduce: '',
      cover: '',
    },

    editor: {
      info: '',
    },

    rules: {
      name: [
        { required: true, message: '请填写学科名称' },
        { max: 10, message: '名称不应大于10个字符' },
      ],
      introduce: [
        { required: true, message: '请填写简介' },
      ],
      cover: [
        { required: true, message: '请添加图片' },
      ],
    },

    treeProps: {
      label: 'name',
      children: 'leaf',
    },

    editTargetID: null,

    initVisible: true,

  }),

  computed: {

    subjectID() {
      return Number(this.$route.params.id);
    },
  },

  created() {
    this.getBefore();

    this.getData();
  },


  methods: {

    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.structure.${key}`, text);
    },

    getBefore() {
      this.$http.get('/structure/index_before')
        .then(({ subject: subjects }) => {
          this.subject = subjects
            .find(item => item.id === this.subjectID);
        });
    },

    getData() {
      const url = `/structure?equal[subject_id]=${this.subjectID}`;

      this.$http.get(url)
        .then(({ structure }) => {
          this.data = structure;
        });
    },

    preLeafCreate(parentID = 0) {
      this.editTargetID = null;

      this.formData = {
        name: '',
        describe: '',
        subject_id: this.subjectID,
        parent_id: parentID,
        introduce: '',
        cover: '',
      };

      this.dialogVisible = true;
    },

    structureCreate(submit) {
      submit()
        .then(this.getData);
    },

    deleteNode(node, data) {
      const url = `/structure/${data.id}`;

      this.$confirm(
        '确定删除该菜单么？',
        '删除确认',
        {
          showCancelButton: true,
          type: 'warning',
          confirmButtonText: '删除',
          confirmButtonClass: 'el-button--danger',
        },
      )
        .then(() => this.$http.delete(url)
          .then(() => this.$message.success('删除菜单成功!'))
          .catch(({ message }) => {
            this.$message.error(`删除菜单失败，${message}`);
          }),
        )
        .then(this.getData);
    },

    appendNode(node, data) {
      this.preLeafCreate(data.id);
    },

    editNode(id) {
      this.formData = {
        name: '',
        subject_id: 0,
        parent_id: 0,
        describe: '',
        introduce: '',
        cover: '',
      };

      this.editTargetID = id;

      this.$http.get(`/structure/${id}`)
        .then((res) => {
          this.formData = { ...res };

          this.dialogVisible = true;
        })
        .catch(() => {
          this.formData = {
            name: '',
            subject_id: 0,
            parent_id: 0,
            describe: '',
            introduce: '',
            cover: '',
          };

          this.dialogVisible = true;
        });
    },

    getCoverUrl(url) {
      this.formData.cover = url;
    },

    changeFn(data) {
      this.formData.describe = data;
    },
  },
};
</script>

<template>
  <div
    v-if="checkPermission('index')"
    class="global-main subject-edition"
  >
    <h2>
      <span>{{ subject.name }}</span>
      <el-button
        v-if="checkPermission('store')"
        type="primary"
        @click="() => preLeafCreate()"
      >
        添加菜单
      </el-button>
    </h2>

    <el-tree
      :props="treeProps"
      :data="data"
      node-key="id"
      children="leaf"
    >
      <div
        slot-scope="{ node, data }"
        class="subject-edition__node"
      >
        <span>{{ node.label }}</span>
        <span class="subject-edition__node-control">
          <el-button
            v-if="checkPermission('update')"
            type="text"
            size="mini"
            @click="() => editNode(data.id, node, data)"
          >
            编辑
          </el-button>
          <el-button
            v-if="checkPermission('delete')"
            :style="{
              visibility: node.isLeaf ? 'visible' : 'hidden'
            }"
            type="text"
            size="mini"
            @click="() => deleteNode(node, data)"
          >
            删除
          </el-button>
          <el-button
            v-if="checkPermission('store')"
            type="text"
            size="mini"
            @click="() => appendNode(node, data)"
          >
            +添加子菜单
          </el-button>
        </span>
      </div>
    </el-tree>

    <AppFormDialog
      :model="formData"
      :rules="rules"
      :visible.sync="dialogVisible"
      :id="editTargetID"
      :object="editTargetID ? '编辑菜单' : '添加菜单'"
      label-width="6em"
      width="800px"
      url="/structure"
      class="subject-dialog"
      @on-submit="structureCreate"
    >
      <el-form-item
        label="菜单名称"
        prop="name"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item
        label="菜单图片"
        prop="cover"
      >
        <AppUploadScale
          v-model="formData.cover"
          class="subject-dialog__img"
          @on-success="getCoverUrl"
        />
      </el-form-item>
      <el-form-item
        label="简介"
        prop="introduce"
      >
        <el-input
          :rows="2"
          v-model="formData.introduce"
          resize="none"
          autosize
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        label="详细介绍"
        prop="describe"
        class="subject-describe"
      >
        <AppTextArea
          :value="formData.describe"
          :init-visible="dialogVisible"
          :is-disable="false"
          @change="changeFn"
        />

      </el-form-item>
    </AppFormDialog>
  </div>
</template>

<style lang="postcss">
.subject-edition {
  padding-top: 0;
}
.subject-edition > h2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.subject-edition__node {
  display: inline-flex;
  width: 700px;
  align-items: center;
  justify-content: space-between;
}
.subject-describe textarea{
  width: 100%;
}
.v-modal{
    width: 0;
    height: 0;
  }
.subject-dialog__img .app-upload-scale__block img{
  height: 100%;
}
</style>
