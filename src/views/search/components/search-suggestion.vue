<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [], // 联想建议数据列表
      htmlStr: 'hi'
    }
  },
  watch: {
    // 属性名： 要监视的数据的名称
    // searchText () {
    //   console.log('hello')
    // }

    // 完整写法：
    searchText: {
      // 当数据发生变化时会执行handler处理函数
      handler: debounce(async function () {
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200), // 输入停止超过0.2s后才会发送请求，函数防抖
      // 让回调在侦听之后立即开始调用
      immediate: true
    }
  },
  methods: {
    highlight (str) {
      // 正则表达式 /中间的内容/ 都会当作正则匹配模式字符对待
      // 错误的写法：/this.searchText/gi
      // RegExp 是正则表达式的构造函数
      // 参数1:字符串
      // 参数2:匹配模式
      // 返回值：正则对象
      if (str) {
        return str.replace(
          new RegExp(this.searchText, 'gi'),
          `<span style="color:red">${this.searchText}</span>`
        )
      }
    }
  }
}
</script>

<style>

</style>
