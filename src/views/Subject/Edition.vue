<script>
/**
 * @overview 学科管理 - 学科结构编辑
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';

export default {
  name: 'SubjectEdition',

  mixins: [list],

  data: () => ({
    subject: {
      name: '',
      id: 0,
    },

    data: [],

    editor: '',

    list: {},


    dialogVisible: false,

    formData: {
      name: '',
      subject_id: 0,
      parent_id: 0,
      describe: '',
      introduce: '',
    },

    rules: {
      name: [
        { required: true, message: '请填写学科名称' },
        { max: 10, message: '名称不应大于10个字符' },
      ],
      introduce: [
        { required: true, message: '请填写简介' },
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
        introduce: '',
      };

      this.dialogVisible = true;

      this.getEditor(300);
    },

    getEditor(sec) {
      if (this.editor) {
        this.editor.setData(this.formData.describe);

        return;
      }

      setTimeout(() => {
        window.CKEDITOR.replace('editor', {
          height: '300px',
          width: '100%',
          toolbar: 'Full',
          language: 'zh-cn',
        });

        this.editor = window.CKEDITOR.instances.editor;

        this.editor.on('instanceReady', () => {
          this.editor.addCommand('image', {
            exec() {
              const input = document.getElementById('product-form-detail__upload');
              input.click();
            },
          });

          this.editor.on('change', () => {
            this.formData.describe = this.editor.getData();
          });
        });

        this.editor.setData(this.formData.describe);
      }, sec);
    },

    structureCreate(submit) {
      submit()
        .then(() => {
          this.getData();
        });
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
      this.editTargetID = id;

      this.dialogVisible = true;

      this.$http.get(`/structure/${id}`)
        .then((res) => {
          this.formData = { ...res };
        })
        .catch(() => {
          this.formData = {
            name: '',
            subject_id: 0,
            parent_id: 0,
            describe: '',
            introduce: '',
          };
        })
        .finally(() => {
          this.getEditor(100);
        });
    },

    canvasDataURL(type, path, obj, callback) {
      const img = new Image();
      const imgType = type || 'image/jpeg';

      img.src = path;
      // eslint-disable-next-line
      img.onload = function () {
        const that = this;
        // 默认按比例压缩
        // eslint-disable-next-line
        let w = that.width,h = that.height,scale = h / w;
        w = obj.width || w;
        h = obj.height || (w / scale);

        let quality = 0.5; // 默认图片质量为0.5

        // 生成canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 创建属性节点
        const anw = document.createAttribute('width');
        anw.nodeValue = w;

        const anh = document.createAttribute('height');
        anh.nodeValue = h;

        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);

        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }

        // quality值越小，所绘制出的图像越模糊
        const base64 = canvas.toDataURL(imgType, quality);

        // 回调函数返回base64的值
        callback(base64);
      };
    },

    convertBase64UrlToFile(urlData, filename) {
      // eslint-disable-next-line
      let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]),n = bstr.length,u8arr = new Uint8Array(n);

      // eslint-disable-next-line
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },

    getImgData(file) {
      const formData = new FormData();

      formData.append('chunk', '0');// 断点传输
      formData.append('chunks', '1');

      formData.append('file', file, file.name);

      const fileType = file.type.split('/')[1];

      // 先从自己的服务端拿到token
      this.$http.get(`/upload/token/${fileType}`)
        .then((res) => {
          formData.append('token', res.token);
          formData.append('key', res.key);

          this.uploading(formData, file);// 然后将参数上传七牛
        });
    },

    uploading(param) {
      const addr = 'https://oa-statics.caihonggou.com/';

      this.$http.post('https://upload.qiniup.com/', param)
        .then((res) => {
          const url = addr + res.key;

          const html = `<img style="width:120px;height:120px;" src="${url}">`;

          this.editor.insertHtml(html);
        })
        .catch(({ message }) => {
          this.$message({
            type: 'error',
            message,
          });
        });
    },

    changeImg() {
      const inputs = this.$refs.inputImg;

      const file = inputs.files[0];

      const pattern = /^image\/(jpe?g|png|bmp|JPE?G|PNG|BMP)$/;
      const isPicture = pattern.test(file.type);

      const isLimit2M = file.size / 1024 / 1024 <= 2;

      if (!isPicture) {
        this.$message.error('上传图片只能是 JPG、PNG、BMP 格式!');

        inputs.value = '';

        return;
      }

      if (isLimit2M) {
        this.getImgData(file);

        inputs.value = '';

        return;
      }

      this.getScalePhoto(file, { quality: 0.3 }, (base64Codes) => {
        const newFile = this.convertBase64UrlToFile(base64Codes, file.name);

        const isAgainLimit2M = newFile.size / 1024 / 1024 <= 2;

        if (!isAgainLimit2M) {
          this.$message.error('上传图片大小过大!');

          return;
        }

        this.getImgData(newFile);
      });

      inputs.value = '';
    },

    getScalePhoto(file, percentage, objDiv) {
      const that = this;
      const ready = new FileReader();

      ready.readAsDataURL(file);

      // eslint-disable-next-line
      ready.onload = function () {
        const result = this.result;
        that.canvasDataURL(file.type, result, percentage, objDiv);
      };
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
            @click="() => editNode(data.id)"
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
      :object="editTargetID ? '编辑菜单' : '添加菜单'"
      label-width="6em"
      width="800px"
      url="/structure"
      @on-submit="structureCreate"
    >
      <el-form-item
        label="菜单名称"
        prop="name"
      >
        <el-input v-model="formData.name" />
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
        class="student-describe"
      >
        <textarea
          id="editor"
          v-model="formData.describe"
          rows="10"
          cols="80"/>
        <input
          id="product-form-detail__upload"
          ref="inputImg"
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/bmp"
          style="display:none;"
          @change="changeImg">
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
.student-describe textarea{
  width: 100%;
}
</style>
