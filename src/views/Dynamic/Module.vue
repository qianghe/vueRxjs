<template>
  <div class="dynamic-module">
    <p class="dynamic-module-title">{{ `Module ${index}`}}</p>
    <a-spin :spinning="spinning" />
    <div class="dynamic-module-content">{{ content }}</div>
  </div>
</template>

<script>
  import { defer } from 'rxjs'
  import consola from 'consola/src/browser'
  import { Spin } from 'ant-design-vue'
  import { delay } from '@/util/tool'
  import { mockContent } from '@/api/mock'

  export default {
    components: {
      ASpin: Spin
    },
    props: {
      timer: Number,
      index: Number
    },
    data() {
      return {
        spinning: true,
        content: '',
        $observer: null
      }
    },
    created() {
      this.$observer = defer(() => new Promise(async resolve => {
        await this.fetchData()
        resolve(true)
      }))
    },
    methods: {
      async fetchData() {
        await delay(this.timer)
        this.content = mockContent().content
        this.spinning = false
        this.logger()
      },
      logger() {
        consola.success(`mock fetch time: ${this.timer}`)
        consola.info(`[${this.$parent?.title}]-[Child-Component-${this.index}] rendered`)
        consola.log('--------')
      }
    }
  }
</script>

<style lang="less">
  .dynamic-module {
    margin-bottom: 10px;

    &-title {
      font-size: 16px;
    }

    &-content {
      font-size: 13px;
      line-height: 20px;
      background-color: #eee;
    }
  }
</style>