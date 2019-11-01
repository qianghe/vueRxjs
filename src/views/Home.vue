<template>
  <div class="home">
    <!--主selectorA-->
    <option-selector
      label="主selectorA"
      :options="AOptions"
      :value="$store.state[moduleName].mockA"
      :onChange="(value) => setSelectorKey('mockA', value)"
    />
    <a-divider orientation="left">Deps Selector</a-divider>
    <div class="deps">
      <!--依赖于A的selectorB-->
      <option-selector
        label="selectorB"
        :options="BOptions"
        :value="$store.state[moduleName].mockB"
        :onChange="value => handleChange('mockB', value)"
      />
      <!--依赖于A的selectorC-->
      <option-selector
        label="selectorC"
        :options="COptions"
        :value="$store.state[moduleName].mockC"
        :onChange="value => handleChange('mockC', value)"
      />
    </div>
    <!--依赖于[B,C]的结果面板-->
    <a-divider orientation="right">Deps Result</a-divider>
    <div class="result">
      <p v-for="(result, key) in results" :key="key">{{result}}</p>
    </div>
    <a-button type="dashed" @click="clear">Clear</a-button>
  </div>
</template>

<script>
// @ is an alias to /src
import uniqid from 'uniqid'
import { forkJoin } from 'rxjs'
import { Divider, Button } from 'ant-design-vue'
import store from '@/store/index'
import OptionSelector from '@/components/OptionSelector'
import { delay } from '@/util/tool'
import { mockOptions } from '@/api/mock'

export default {
  name: 'home',
  components: {
    OptionSelector,
    ADivider: Divider,
    AButton: Button
  },
  data() {
    return {
      // 也可以和路由相关
      moduleName: uniqid.time(),
      AOptions: [],
      BOptions: [],
      COptions: [],
      results: [],
      $observable: null
    }
  },
  created() {
    // 动态注册store module
    store.registerModule(this.moduleName, {
      namespace: true,
      state: {
        mockA: 0,
        mockB: 0,
        mockC: 0
      },
      mutations: {
        set_value(state, { key, value }) {
          state[key] = value
        }
      }
    })
  },
  mounted() {
    this.fetchAOption()
  },
  destroyed() {
    store.unregisterModule(this.moduleName)
  },
  computed: {
    mockAState() {
      return this.$store.state[this.moduleName]?.mockA
    }
  },
  watch: {
    AOptions(newVal) {
      if (Array.isArray(newVal)) {
        this.setSelectorKey('mockA', newVal[0].id)
      }
    },
    BOptions(newVal) {
      if (Array.isArray(newVal)) {
        this.setSelectorKey('mockB', newVal[0].id)
      }
    },
    COptions(newVal) {
      if (Array.isArray(newVal)) {
        this.setSelectorKey('mockC', newVal[0].id)
      }
    },
    mockAState(newVal) {
      // A变化了～～
      const $observable = forkJoin([
        new Promise(async resolve => {
          this.BOptions = await this.fetchBOption()
          resolve(true)
        }),
        new Promise(async resolve => {
          this.COptions = await this.fetchCOption()
          resolve(true)
        }),
      ])
      if (newVal) {
        $observable.subscribe({
          complete: () => {
            const { mockB, mockC } = this.$store.state[this.moduleName]
            this.dealResult([{
              key: 'mockB',
              value: mockB
            }, {
              key: 'mockC',
              value: mockC
            }])
          }
        })
      }
    }
  },
  methods: {
    setSelectorKey(key, value) {
      this.$store.commit('set_value', { key, value })
    },
    // 请求A数据源
    async fetchAOption() {
      await delay()
      this.AOptions = mockOptions('A').options
    },
    // 请求B数据源
    async fetchBOption() {
      await delay(2500)
      return mockOptions('B').options
    },
    // 请求C数据源
    async fetchCOption() {
      await delay(4000)
      return mockOptions('C').options
    },
    handleChange(key, value) {
      this.setSelectorKey(key, value)
      this.dealResult([{ key, value }])
    },
    // 依赖源的结果输出
    dealResult(results) {
      const resultStr = results.reduce((pre, { key, value }) => {
        pre.push(`${key}: ${value}`)
        return pre
      }, []).join(', ')
      this.results.push(`fetch is done -- ${resultStr}`)
    },
    clear() {
      this.results = []
    }
  }
}
</script>

<style lang="less">
  .home {
    width: 30vw;
    margin-left: 30px;
    margin-top: 30px;

    .deps{
      display: flex;

      >div {
        margin-right: 20px;
      }
    }
    .result {
      padding: 20px;
      margin-bottom: 20px;
      background-color: #eee;
    }

    button[type="button"] {
      width: 100%;
    }
  }
</style>
