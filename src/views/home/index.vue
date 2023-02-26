<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <!-- 标签页组件有一个功能，只有你第一次查看标签页的时候才会渲染里面的内容 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <ArticleList :channel="channel" />
      </van-tab>
      <!--  汉堡按钮定位了把列表最后的位置挡住了，所以添加一个和汉堡元素一样大的占位元素 -->
      <div
        class="wap-nav-placeholder"
        slot="nav-right"></div>
      <div
        slot="nav-right"
        @click="isChannelEditShow=true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->

    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%;"
    >
      <ChannelEdit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      />
      <!-- $event就是传进函数的参数index -->
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'MyHome',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 编辑频道弹窗
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录，判断是否有本地存储的频道列表数据
        const localChannels = getItem('user-channels')
        if (localChannels) {
          // 如果有本地存储的频道列表则使用
          channels = localChannels
        } else {
          // 如果没有，就请求获取默认的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中以供使用
      this.channels = channels

      // // 请求获取频道数据
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
    }

    // onUpdateActive (index) {
    //   this.active = index
    // }
  }
}
</script>

<style scoped lang="less">
.home-container {
  ::v-deep .van-nav-bar__title {
    max-width: 100%;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    border: none;
    .van-icon {
      font-size: 16px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 16px !important;
      height: 3px;
      margin-bottom: 8px;
      background: #3296fa !important;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
    // 表示不参与父元素的flex分配（？）
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    line-height: 44px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .9;
    .van-icon {
      font-size: 22px
    }
    &:before {
      content: '';
      width: 1px;
      height: 29px;
      // background: 没有找到图片文件qaq
    };
  }
}
</style>
