<script>
/**
 * @overview  课程选择
 *
 * @author suyanping
 */

export default {
  name: 'CourseSelect',

  props: {
    subjectList: {
      type: Array,
      default: () => [],
    },

    structureName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      course: '',

      subjectId: null,

      firId: null,

      structureId: null,

      name: '',

      firStructure: [],

      secStructure: [],
    };
  },

  mounted() {
    window.document.addEventListener('click', (e) => {
      const isClassName = e.target.className === 'course-select__name';

      this.course = document.getElementsByClassName('course-select__content')[0];

      if (isClassName) {
        this.course.style.display = 'block';

        return;
      }

      if (this.course) {
        this.initData();
      }
    });
  },

  methods: {
    initData() {
      this.course.style.display = 'none';

      this.firStructure = [];

      this.secStructure = [];

      this.subjectId = null;

      this.firId = null;

      this.structureId = null;

      this.name = '';
    },

    stopDefault() {},

    getFirStructure(id, name, children) {
      this.secStructure = [];

      if (id === this.subjectId) return;

      this.subjectId = id;

      this.firStructure = children;
    },

    stopFirDefault(id, name, children) {
      if (children) return;

      this.structureId = id;

      this.name = name;

      this.$emit('getData', { name: this.name, subjectId: this.subjectId, structureId: this.structureId });

      this.initData();
    },

    getSecStructure(id, name, children) {
      if (id === this.firId) return;

      this.firId = id;

      if (children) {
        this.secStructure = children;
      }
    },

    getFinallyStructure(id, name) {
      this.stopFirDefault(id, name);
    },
  },
};
</script>

<template>
  <div class="course-select">

    <div class="course-select__name">
      {{ structureName }}
    </div>

    <div class="course-select__content">

      <div
        class="course-select__subject">
        <div
          v-for="item in subjectList"
          :key="item.id"
          :class="item.id === subjectId
          ? 'course-select-subject__back' : ''"
          @click.stop="stopDefault()"
          @mousemove="getFirStructure(item.id,item.name,item.structure)">
          {{ item.name }}
        </div>
      </div>

      <div
        v-if="firStructure.length > 0"
        class="course-select__firStructure">
        <div
          v-for="item in firStructure"
          :key="item.id"
          :class="item.id === firId
          ? 'course-select-subject__back' : ''"
          @click.stop="stopFirDefault(item.id,item.name,item.leaf)"
          @mousemove="getSecStructure(item.id,item.name,item.leaf)">
          {{ item.name }}
        </div>
      </div>

      <div
        v-if="secStructure.length > 0"
        class="course-select__secStructure">
        <div
          v-for="item in secStructure"
          :key="item.id"
          @click.stop="getFinallyStructure(item.id,item.name)">
          {{ item.name }}
        </div>
      </div>

    </div>

  </div>
</template>

<style lang="postcss">
.course-select__name{
  width: 330px;
  height: 40px;
  padding-left: 15px;
  border: 1px solid gainsboro;
  border-radius: 5px;
}

.course-select__content{
  position: relative;
  display: none;
}

.course-select__subject,
.course-select__firStructure,
.course-select__secStructure
{
  cursor: pointer;
  position: absolute;
  z-index: 1000;
  top: 2px;
  left: 0;
  background: white;
  text-align: center;
  overflow: auto;
  max-height: 160px;
  width: 150px;
  border: 1px solid #D2D2D2;
}

.course-select__firStructure{
  left: 150px;
}

.course-select__secStructure{
  left: 300px;
}

.course-select-subject__back{
  background: ghostwhite;
}

.course-select__secStructure>div:hover{
  background: ghostwhite;
}
</style>
