<script>
/**
 * @overview 富文本组件
 *
 * @author yehaifeng
 */
import E from 'wangeditor';

export default {

  name: 'AppTextArea',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    isDisable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      editorText: null,

      info: null,
    };
  },

  watch: {
    value(val) {
      this.editorText.txt.html(val);
    },
  },

  mounted() {
    this.seteditorText();
  },

  methods: {
    seteditorText() {
      this.editorText = new E(this.$refs.toolbar, this.$refs.editorText);

      this.editorText.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editorText.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间


      // 配置菜单
      this.editorText.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ];

      this.editorText.customConfig.onchange = (html) => {
        this.info = html;

        this.$emit('change', this.info);
      };

      // 创建富文本编辑器
      this.editorText.create();

      if (this.isDisable) {
        this.editorText.$textElem.attr('contenteditable', false);
      }
    },
  },
};
</script>

<template lang="html">
  <div class="editorText">
    <div
      ref="toolbar"
      class="toolbar"/>

    <div
      ref="editorText"
      class="text"/>
  </div>
</template>

<style lang="postcss">
.editorText {
  width: 100%;
  margin: 0 auto;
}

.editorText .w-e-text-container{
  z-index: 0 !important;
}

.editorText .w-e-toolbar{
  position: relative;
  z-index: 1;
}

.toolbar {
  border: 1px solid #ccc;
}

.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
