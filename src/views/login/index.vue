<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-cell-group inset>
        <van-field
          v-model="user.mobile"
          icon-prefix="icon"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="icon"
          left-icon="yanzhengma"
          center
          placeholder="请输入验证码"
          name="code"
          :rules="formRules.code"
        >
          <template #button>
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 60"
              format="ss s"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              class="send-btn"
              size="small"
              native-type="button"
              round
              :loading="isSendSmsLoading"
              @click.prevent="onSendSms"
            >获取验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          type="primary"
          block
          native-type="submit"
        >登录/注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '17090086870',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: blur },
          { pattern: /^1[35789]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  methods: {
    async onLogin () {
      Toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长（ms），值为0时toast不会消失
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data } = await login(this.user)
        Toast.success('登录成功')

        // 将后端返回的用户登录状态放到Vuex容器中
        this.$store.commit('setUser', data.data)

        // 登录成功，跳转回原来页面
        this.$router.back() // 先用这种方式，但是它不太好
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败，手机号或验证码错误')
      }
      // 4.处理响应结果
    },

    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },

    async onSendSms () {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 防止网络慢，用户多次触发发送行为
        await sendSms(this.user.mobile)
        // 短信发出去了，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的提示
          message = err.message
        } else {
          // 未知错误
          message = '发送时报，请稍后重试'
        }
        // try里面任何代码的错误都会进入catch
        // 不同的错误有不同的提示，那就需要判断了
        // 提示用户
        this.$toast({
          message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
      // 不管成功与否都取消加载状态
      this.isSendSmsLoading = false
      // 校验手机号码
      // 验证通过 -> 请求发送验证码 -> 用户接收
      // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
      // 倒计时结束 -> 隐藏倒计时，显示发送按钮
    }
  }
}
</script>

<style lang="less">
  .login-container {
    .send-btn {
      width: 76px;
      height: 23px;
      line-height: 23px;
      background-color: #ededed;
      .van-button__text {
        font-size: 11px;
        color: #666666;
      }
    }
    .login-btn-wrap {
      padding: 26px 16px; // 先上下，再左右
      .login-btn {
        background-color: #6db4fb;
        border: none;
        .van-button__text {
          font-size: 15px;
        }
      }
    }
  }
</style>
