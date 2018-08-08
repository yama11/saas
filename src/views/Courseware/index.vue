<script>
/**
 * @overview 课时内容 - 课时列表
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';
import ListMain from './components/ListMain';

export default {
  name: 'CoursewareList',

  components: {
    ListMain,
  },

  mixins: [list],

  data: () => ({
    subjects: [],

    list: {
      data: [],
    },

    structure: [],

    treeProps: {
      label: 'name',
      children: 'leaf',
    },
  }),

  computed: {
    currentSubjectID() {
      return Number(this.$route.query.subject) || null;
    },

    subjectList() {
      return this.subjects
        .map(({ name, id }) => ({ name, id }));
    },

    structureList() {
      return this.findStructure(this.currentSubjectID);
    },
  },

  mounted() {
    this.getBefore();
  },

  beforeRouteUpdate(to, from, next) {
    this.getCourseList(to);

    next();
  },

  methods: {
    getBefore() {
      this.loading = true;

      this.$http.get('/course/index_before')
        .then(({ subjects }) => {
          this.subjects = subjects || [];

          if (
            this.$route.query['equal[structure_id]']
            &&
            this.$route.query.subject
          ) {
            this.getCourseList();
          } else {
            this.courseInit();
          }
        })
        .then(() => {
          const structure = Number(this.$route.query['equal[structure_id]']);

          this.$refs.tree.setCurrentKey(structure);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    courseInit() {
      if (this.subjects.length === 0) return;

      const subject = this.subjects[0].id;
      const structure =
        this.subjects[0] && this.subjects[0].structure.length
          ? this.findStructureLeaf(this.subjects[0].structure[0])
          : null;

      const query = structure && structure.id
        ?
        {
          ...this.$route.query,
          subject,
          'equal[structure_id]': structure.id,
        }
        :
        {
          ...this.$route.query,
          subject,
        };

      this.$router.push({ query });
    },

    getCourseList(route = this.$route) {
      const { subject, ...query } = route.query;

      if (!query['equal[structure_id]']) {
        this.list = { data: [] };
      } else {
        this.$_listMixin_getList('/course', query)
          .then((data) => {
            this.list = data;
          });
      }
    },

    selectSubject(value) {
      const subject = value;

      const structures = this.findStructure(subject);

      const structure = structures.length
        ? this.findStructureLeaf(structures[0])
        : null;

      const {
        'equal[structure_id]': flilter,
        ...oldQuery
      } = this.$route.query;

      const query = structure && structure.id
        ?
        {
          ...oldQuery,
          subject,
          'equal[structure_id]': structure.id,
        }
        :
        {
          ...oldQuery,
          subject,
        };

      this.$router.push({ query });
    },

    findStructure(subjectID) {
      const subject = this.subjects
        .find(item => item.id === subjectID);

      return (subject && subject.structure)
        ? subject.structure
        : [];
    },

    findStructureLeaf(node) {
      return node.leaf && node.leaf.length
        ? this.findStructureLeaf(node.leaf[0])
        : node;
    },

    selectStructure(data) {
      if (data.leaf) return;

      const query = {
        ...this.$route.query,
        'equal[structure_id]': data.id,
      };

      this.$router.push({ query });
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    class="global-main courseware-list"
  >
    <h2>
      <span>课时内容</span>
      <el-select
        :value="currentSubjectID"
        placeholder="请选择学科"
        class="courseware-list__subject"
        @input="selectSubject"
      >
        <el-option
          v-for="item in subjectList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
    </h2>

    <div class="courseware-list__body">
      <el-tree
        ref="tree"
        :props="treeProps"
        :data="structureList"
        highlight-current
        default-expand-all
        node-key="id"
        children="leaf"
        class="courseware-list__menu"
        @node-click="selectStructure"
      />

      <ListMain
        :list="list"
        @update="getCourseList"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.courseware-list {

}

.courseware-list__subject {
  margin-left: 230px;
}

.courseware-list__body {
  flex-grow: 1;
  display: flex;
}

.courseware-list__menu {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid rgba(232,237,250);
}
</style>
