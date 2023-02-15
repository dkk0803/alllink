<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        class="base-info"
        title=""
        value=""
        center
        :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button
          class="update-btn"
          size="small"
          round
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">帖子</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./手机.svg" alt="手机">
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon="star-o"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon="underway-o"
        text="历史"
      />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MySetting',
  data () {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    },

    onLogout () {
      // 提示用户确认退出
      // 确认 -> 处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // on confirm
          // 清除用户登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
  .my-container {
    .my-info {
      background: url("./banner.png") no-repeat;
      background-size: cover;
      .base-info {
        box-sizing: border-box;
        height: 115px;
        background-color: unset;
        padding-top: 38px;
        padding-bottom: 11px;
        .avatar {
          box-sizing: border-box;
          width: 66px;
          height: 66px;
          border: 1px solid #fff;
          margin-right: 11px;
        }
        .name {
          font-size: 15px;
          color: #fff;
        }
        .update-btn {
          height: 16px;
          font-size: 10px;
          color: #666666;
          line-height: 16px;
        }
      }
      .data-info {
        .data-info-item {
          height: 65px;
          color: #fff;
          .text-wrap {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .count {
              font-size: 18px;
              color: #fff;
            }
            .text {
              font-size: 11px;
              color: #fff;
            }
          }
        }
      }
      /deep/ .van-grid-item__content {
        background-color: unset;
      }
    }

    .not-login {
      height: 180px;
      background: url("./banner.png") no-repeat;
      background-size: cover;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .mobile {
        width: 40px;
        height: 40px;
        padding: 10px;
        background-color: #fff;
        border-radius: 40px;
        color: skyblue;
      }
      .text {
        font-size: 14px;
        color: #fff;
      }
    }

    .nav-grid {
      .nav-grid-item {
        height: 70px;
        .van-grid-item__text {
          font-size: 14px;
          color: #333333;
        }
      }
    }
    .logout-cell {
      text-align: center;;
      color: #d86262
    }
    .mb-4 {
      margin-bottom: 4px;
    }
  }
</style>
