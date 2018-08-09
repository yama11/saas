<script>
/**
 * @overview 学科管理 - 学科结构编辑
 *
 * @author huojinzhao
 */

export default {
  name: 'SubjectEdition',

  data: () => ({
    subject: {
      name: '',
      id: 0,
    },

    data: [],

    dialogVisible: false,

    formData: {
      name: '',
      subject_id: 0,
      parent_id: 0,
      describe: '',
    },

    rules: {
      name: [
        { required: true, message: '请填写学科名称' },
        { max: 10, message: '名称不应大于10个字符' },
      ],
    },

    treeProps: {
      label: 'name',
      children: 'leaf',
    },

    editTargetID: null,
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
        })
        .then(() => this.$http.delete(url))
        .then(this.getData)
        .catch(() => {
          this.$message.error('删除菜单失败!');
        });
    },

    appendNode(node, data) {
      this.preLeafCreate(data.id);
    },

    editNode({
      id,
      name,
      subject_id,
      parent_id,
      describe = '',
    }) {
      this.editTargetID = id;

      this.formData = {
        id,
        name,
        subject_id,
        parent_id,
        describe,
      };

      this.dialogVisible = true;
    },
  },
};
</script>

<template>
  <div class="global-main subject-edition">
    <h2>
      <span>{{ subject.name }}</span>
      <el-button
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
            type="text"
            size="mini"
            @click="() => editNode(data)"
          >
            编辑
          </el-button>
          <el-button
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
      label-width="6em"
      width="500px"
      url="/structure"
      object="添加学科"
      @on-submit="structureCreate"
    >
      <el-form-item
        label="菜单名称"
        prop="name"
      >
        <el-input v-model="formData.name" />
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

.subject-edition__node-control {

}
</style>
