<template>
  <AppCheckMap
    :value="value"
    class="role-permissions"
    @input="value => $emit('input', value)"
  >
    <template v-if="options">
      <AppCheckBox
        v-for="level1 in options"
        :key="level1.id"
        :value="level1.id"
        :label="level1.name"
        class="role-permissions__level1"
      >
        <template v-if="level1.children">
          <AppCheckBox
            v-for="level2 in level1.children"
            :key="level2.id"
            :value="level2.id"
            :label="level2.name"
            direction="row"
            class="role-permissions__level2"
          >
            <template v-if="level2.children">
              <AppCheckBox
                v-for="level3 in level2.children"
                :key="level3.id"
                :value="level3.id"
                :label="level3.name"
                class="role-permissions__level3"
              />
            </template>
          </AppCheckBox>
        </template>
      </AppCheckBox>
    </template>
  </AppCheckMap>
</template>

<script>
/**
 * 权限列表组件
 * @author huojinzhao
 * @param {Array}   options   权限数组
 * @param {Array}   value     选中的权限
 */

export default {
  name: 'Permissions',

  props: {
    options: {
      type: Array,
      required: true,
    },

    value: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="postcss">
.role-permissions{
  --border-color: rgb(220, 223, 230);

  border-top: 1px solid var(--border-color);
}

.role-permissions .app-check-box__self {
  margin-right: 2.9em;
}

.role-permissions .app-check-box__children {
  flex-wrap: wrap;
}

.role-permissions__level1 {
  border-bottom: 1px solid var(--border-color);
}

.role-permissions__level2 {
  border-bottom: 1px solid var(--border-color);
}

.role-permissions__level2:last-child {
  border: none;
}

.role-permissions__level3 {

}
</style>
