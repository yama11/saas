<script>
/**
 * @overview 学科管理 - 学科结构编辑 - 富文本组件
 *
 * @author yehaifeng
 */
import E from 'wangeditor';

export default {

  name: 'Editorbar',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    initVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {

      editor: null,

      info: null,

      formData: {},
    };
  },

  watch: {
    initVisible(val) {
      if (val) {
        this.editor.txt.html(this.value);
      }
    },
  },

  mounted() {
    this.seteditor();
  },

  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
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

      this.editor.customConfig.customUploadImg = (files) => {
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

      this.editor.customConfig.onchange = (html) => {
        this.$emit('change', html);
      };

      // 创建富文本编辑器
      this.editor.create();

      this.editor.txt.html(this.value);
    },


    uploading(param) {
      const addr = 'https://oa-statics.caihonggou.com/';

      this.$http.post('https://upload.qiniup.com/', param)
        .then((res) => {
          const url = addr + res.key;
          this.editor.cmd.do('insertHtml', `<img src="${url}" style="max-width:100%;"/>`);
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

<template>
  <div class="editor">
    <div
      ref="toolbar"
      class="toolbar"/>
    <div
      ref="editor"
      class="text"/>
  </div>
</template>

<style lang="postcss">
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
