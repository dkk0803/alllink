<template>
  <div class="article-container">
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <h1 class="title">{{ article.title }}</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
         slot="icon"
         class="avatar"
         round
         fit="cover"
         :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
      <van-button
        class="follow-btn"
        :type="article.is_followed ? 'default' : 'info' "
        :icon="article.is_followed ? '' : 'plus' "
        round
        size="small"
        :loading="isFollowLoading"
        @click="onFollow"
      >{{ article.is_followed ? '已关注' : '关注'}}</van-button>
    </van-cell>
    <div
      class="markdown-body"
      v-html="article.content"
      ref="article-content"
    >
    </div>
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        slot="title"
        type="default"
        round
        hairline
        size="small"
      >
        写评论
      </van-button>
      <van-icon
        name="comment-o"
        info="123"
        color="#777"
      />
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      />
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article/'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'

// 在组件中获得动态路由参数：
//  1. this.$route.params.xxx
//  2. props 传参，推荐
export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false, // 关注按钮的状态
      isCollectLoading: false
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // 数据改变影响视图更新（DOM数据）不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的视图 DOM，需要把这个代码放到 $nextTick中
      this.$nextTick(() => {
        this.handlePreviewImage()
      })
    },

    handlePreviewImage () {
      // 获取文章内容 DOM 容器
      const articleContent = this.$refs['article-content']
      // 得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')
      // 循环 img 列表，给 img 注册点击事件
      const imgPaths = [] // 收集所有的图片路径
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },

    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注则取消关注
        await deleteFollow(this.article.aut_id)
      } else {
        // 没有关注则添加关注
        await addFollow(this.article.aut_id)
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },

    async onCollect () {
      // 另一种禁止多次点击的方法
      this.$toast.loading({
        message: '操作中……',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.is_collected) {
        // 已收藏则取消收藏
        await deleteCollect(this.articleId)
      } else {
        // 没有收藏则添加收藏
        await addCollect(this.articleId)
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },

    async onLike () {
      // 另一种禁止多次点击的方法
      this.$toast.loading({
        message: '操作中……',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.attitude === 1) {
        // 已点赞则取消点赞
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 没有点赞则添加点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      // 更新视图
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    }
  }
}
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .avatar {
    height: 35px;
    width: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding:14px;
  background-color: #fff;
}

.article-bottom {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  .comment-btn {
    width: 50%;
  }
}
</style>
