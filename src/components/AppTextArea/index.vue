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

    initVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      editorText: null,

      formData: {},
    };
  },

  watch: {
    initVisible(val) {
      if (val) {
        this.editorText.txt.html(this.value);
      }
    },
  },

  mounted() {
    this.seteditorText();
  },

  methods: {
    seteditorText() {
      this.editorText = new E(this.$refs.toolbar, this.$refs.editorText);

      this.editorText.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      this.editorText.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M

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

      this.editorText.customConfig.customUploadImg = (files) => {
        const file = files[0];
        this.formData = new FormData();

        this.formData.append('chunk', '0');// 断点传输
        this.formData.append('chunks', '1');

        this.formData.append('file', file, file.name);

        const fileType = file.type.split('/')[1];

        // 先从自己的服务端拿到token
        this.$http.get(`/upload/token/${fileType}`)
          .then((res) => {
            this.formData.append('token', res.token);
            this.formData.append('key', res.key);
            this.uploading(this.formData);
          });
      };

      this.editorText.customConfig.onchange = (html) => {
        this.$emit('change', html);
      };

      // 创建富文本编辑器
      this.editorText.create();

      this.editorText.txt.html(this.value);

      if (this.isDisable) {
        this.editorText.$textElem.attr('contenteditable', false);
      }
    },

    uploading(param) {
      const addr = 'https://oa-statics.caihonggou.com/';

      this.$http.post('https://upload.qiniup.com/', param)
        .then((res) => {
          const url = addr + res.key;
          this.editorText.cmd.do('insertHtml', `<img src="${url}" style="max-width:100%;"/>`);
        })
        .catch(({ message }) => {
          this.$message({
            type: 'error',
            message,
          });
        });
    },
  },
};
</script>

<template lang="html">
  <div class="app-text-area">
    <div
      ref="toolbar"
      class="app-text-area__tool"/>

    <div
      ref="editorText"
      class="app-text-area__text"/>
  </div>
</template>

<style lang="postcss">
.app-text-area {
  width: 100%;
  margin: 0 auto;
}

.app-text-area .w-e-text-container{
  z-index: 0 !important;
}

.app-text-area .w-e-toolbar{
  position: relative;
  z-index: 1;
}

.app-text-area__tool {
  border: 1px solid #ccc;
}

.app-text-area__text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
