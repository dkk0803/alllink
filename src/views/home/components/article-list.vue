<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isPullDownLoading"
      :success-text="refreshSuccessText"
      :success-duration="1000"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title" -->
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isPullDownLoading: false,
      refreshSuccessText: '' // 下拉刷新成功的文本
    }
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道ID
        timestamp: this.timestamp || Date.now() // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传制定的时间戳
        // withtop: 1
      })

      // 2.把数据放到list数组中
      const { results } = data.data
      this.articles.push(...results)

      // 3.设置本次加载状态结束，它才可以判断是否需要加载下一次
      this.loading = false

      // 4.数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },

    async onRefresh () {
      // 下拉刷新，组件自己就会展示loading状态
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道ID
        timestamp: Date.now() // 该项目接口只要传递不同的时间戳，就一定给你返回不一样的数据
        // withtop: 1
      })
      // 2.把数据放到数据列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)

      // 3.关闭刷新的状态
      this.isPullDownLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style>
  .article-list {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    top: 90px;
    overflow-y: auto;
  }
</style>
