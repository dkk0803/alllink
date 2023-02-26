<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus='isResultShow = false'
      />
    </form>
    <!-- 搜索结果 -->
    <SearchResult
      v-if="isResultShow"
      :search-text="searchText"
    />

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'
// import { mapstate } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data () {
    return {
      searchText: '', // 输入框的内容
      isResultShow: false,
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch (searchText) {
      // 把输入框设置为想搜索的文本
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项移除
        this.searchHistories.splice(index, 1)
      }

      // 把最新的搜索历史记录放到顶部
      this.searchHistories.unshift(searchText)

      // 如果用户已登录，把搜索历史存储到线上（只要调用数据接口，后端会帮存）
      // 如果没登录，把搜索历史存到本地
      setItem('search-histories', this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    }

    // loadSearchHistories () {
    //   const localHistories = getItem('search-histories') || []
    //   if (this.user) {
    //     console.log('');
    //   }
    //   // 合并数组： [...数组, ...数组]
    //   // 把Set转为数组：[...Set对象]
    //   // 数组去重： [...new Set([...数组, ...数组])]
    // }
  }
}
</script>

<style>

</style>
