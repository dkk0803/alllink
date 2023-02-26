<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span
          @click="$emit('update-histories', [])"
        >全部删除</span>
        <!-- prop 数据如果是引用类型（数组、对象）可以修改

            但是任何prop数据都不能重新复制

            如果想让prop数据 = 新的数据，让父组件自己修改 -->
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow=true"
      />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in histories"
      :key="index"
      @click="onDelete(history, index)"
    >
      <van-icon
        name="close"
        v-show="isDeleteShow"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'

export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false,
      histories: this.searchHistories
    }
  },
  watch: {
    searchHistories () {
      this.histories = this.searchHistories
    }
  },
  methods: {
    onDelete (history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.histories.splice(index, 1)
        // 持久化处理
        // 1. 修改本地存储的数据
        // 2. 请求接口删除线上的数据
        setItem('search-histories', this.histories)
        return
      }
      // 非删除状态，要展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style>

</style>
