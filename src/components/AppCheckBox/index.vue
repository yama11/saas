<script>
/**
 * @overview  多选级联单元组件
 *
 * @author  huojinzhao
 */

export default {
  name: 'AppCheckBox',

  inject: [
    '$_appCheckMap',
    '$_appCheckMap_isValueIncluded',
    '$_appCheckMap_reportMap',
  ],

  props: {
    value: {
      type: [Number, String],
      default: null,
    },

    label: {
      type: String,
      required: true,
    },

    // 子集排列方向
    direction: {
      type: String,
      default: 'column',
    },

    // [suspend] 扩展，父box下行响应
    downStream: {
      type: Boolean,
      default: false,
    },

    // [suspend] 扩展，子box上行响应
    upStream: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    // 下层（仅一层）实例初始化的appCheckBox的VNode
    // children: VNode[] = []
    // children: [],

    // 下层appCheckBox的value值
    childrenValue: [],
  }),

  computed: {
    childrenStyle() {
      return {
        'flex-direction': this.direction,
      };
    },

    mirrorValue() {
      return this.isBoxValueIncluded(this.value);
    },

    _boxParent() {
      let parent = this.$parent;

      while (parent) {
        const name = parent.$options.name;
        if (name === 'AppCheckBox') return parent;

        parent = parent.$parent;
      }

      return null;
    },
  },

  watch: {
    mirrorValue: 'monitorMirrorValue',
  },

  created() {
    this.registerInBoxParent();
  },

  methods: {
    isBoxValueIncluded(value) {
      return this.$_appCheckMap_isValueIncluded(value);
    },

    /**
     * 只涉及自身值在$_appCheckMap_valueList的变化
     * AppCheckBox联动在 $watch.mirrorValue 监听管理
     */
    changeSelfValue() {
      const state = !this.mirrorValue;

      this.$_appCheckMap_reportMap(state, this.value);

      // downStream全选子项目，先注释
      // if (state && this.childrenValue.length) {
      //   this.broadcastBoxChildren(true);
      // }
    },

    /**
     * 监听自身值得变化，true联动父级，false联动子级
     * @param   {Boolean}   value   变化后的mirrorValue值
     */
    monitorMirrorValue(value) {
      // eslint-disable-next-line
      const parent = this._boxParent;

      const isParentGanged = value
        && parent
        && !this.isBoxValueIncluded(parent.value);

      const isChildrenGanged = !value;

      if (isParentGanged) this.$_appCheckMap_reportMap(value, parent.value);

      if (isChildrenGanged) this.broadcastBoxChildren(value);
    },

    /**
     * 在父级AppCheckBox中注册自己的值
     */
    registerInBoxParent() {
      // eslint-disable-next-line
      const parent = this._boxParent;

      if (parent) parent.childrenValue.push(this.value);
    },

    /**
     * 广播所有子组件全体变化
     * @param   {Boolean}   state   true: 增加  false: 删除
     */
    broadcastBoxChildren(state) {
      this.$_appCheckMap_reportMap(state, this.childrenValue);
    },
  },
};
</script>

<template>
  <div class="app-check-box">
    <el-checkbox
      ref="self"
      :value="mirrorValue"
      class="app-check-box__self"
      @click.native.stop.prevent="changeSelfValue"
    >
      {{ label }}
    </el-checkbox>
    <div
      :style="childrenStyle"
      class="app-check-box__children"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.app-check-box {
  display: flex;
}

.app-check-box__self {
  margin-right: 3em;
}

.app-check-box__children {
  display: inline-flex;
  width: 100%;
}
</style>
