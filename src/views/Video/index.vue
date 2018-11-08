<script>
/**
 * @overview 家长端管理 - 视频配置
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import errorHandler from '@/components/AppFormAlert/errorHandler';
import VideoItem from './VideoItem';

export default {
  name: 'VideoList',

  components: {
    VideoItem,
  },

  mixins: [list],

  data() {
    return {
      list: {},

      formData: {
        title: '',
        description: '',
        cover_image: '',
        link: '',
      },

      formRules: {
        title: [
          this.$rules.required('标题'),
        ],

        description: [
          this.$rules.required('描述'),
        ],

        cover_image: [
          this.$rules.required('封面图'),
        ],
      },

      videoId: null,

      visible: false,
    };
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`client.video.${key}`, text);
    },

    createVideo() {
      this.visible = true;

      this.formData = {
        title: '',
        description: '',
        cover_image: '',
        link: '',
      };
    },

    updateVideo(id) {
      this.videoId = id;

      this.visible = true;

      this.$http.get(`/video/${id}`)
        .then((res) => {
          this.formData = {
            title: res.title,
            description: res.description,
            cover_image: res.cover_image,
            link: res.link,
          };
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    deleteVideo(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '视频',
        '/video',
        this.$refs.list,
      );
    },

    shelveVideo(id) {
      this.$confirm(
        '确定上架该视频？',
        '确认上架',
        {
          showCancelButton: true,
          type: 'primary',
          confirmButtonText: '上架',
          confirmButtonClass: 'el-button--primary',
        })
        .then(() => {
          this.sureShelve(id);
        })
        .catch(() => {});
    },

    sureShelve(id) {
      this.$http.post(`/video/${id}/shelve`)
        .then(() => this.$refs.list.getList())
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    offShelveVideo(id) {
      this.$http.post(`/video/${id}/off_shelve`)
        .then(() => this.$refs.list.getList())
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    getCoverUrl(url) {
      this.formData.cover_image = url;
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList())
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store') ? '添加视频' : null"
    api="/video"
    title="视频配置"
    class="video-list"
    @create="createVideo"
  >

    <template
      v-if="checkPermission('index')"
      slot-scope="props"
    >
      <VideoItem
        v-for="item in props.listData"
        :key="item.id"
        :data="item"
        @getUpdate="updateVideo"
        @getDelete="deleteVideo"
        @getShelve="shelveVideo"
        @getOffShelve="offShelveVideo"/>

      <AppFormDialog
        :visible.sync="visible"
        :rules="formRules"
        :model="formData"
        :id="videoId"
        :object="videoId ? '编辑视频' : '添加视频'"
        url="/video"
        label-width="6em"
        width="800px"
        @on-submit="submitEdition"
      >
        <el-form-item
          prop="title"
          label="标题"
        >
          <el-input
            v-model="formData.title"
            :maxlength="15"
            placeholder="请输入标题"
          />
        </el-form-item>

        <el-form-item
          prop="description"
          label="描述"
        >
          <el-input
            v-model="formData.description"
            :maxlength="50"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item
          prop="cover_image"
          label="封面图">
          <AppUploadScale
            v-model="formData.cover_image"
            class="video-list__cover"
            @on-success="getCoverUrl"/>
        </el-form-item>

        <el-form-item
          prop="link"
          label="视频链接"
        >
          <el-input
            v-model="formData.link"
            placeholder="请输入视频链接"
          />
        </el-form-item>
      </AppFormDialog>
    </template>

  </AppList>
</template>

<style lang="postcss">
.video-list__cover img{
  width: 150px;
  height: 150px;
}
</style>
