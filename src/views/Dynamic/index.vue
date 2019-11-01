<template>
  <div class="dynamic-page">
    <ui-layout
      v-for="({ title, components, lazy }, index) in config"
      :storeModuleName="storeModuleName"
      :key="index"
      :lazy="lazy"
      :title="title"
    >
      <module-comp
        v-for="(comp, index) in components"
        :key="index"
        :index="index + 1"
        :timer="comp.timer"
      />
    </ui-layout> 
  </div>
</template>

<script>
  import uniqid from 'uniqid'
  import store from '@/store/index'
  import UiLayout from '@/components/Layout'
  import ModuleComp from './Module'

  const config = [{
    title: 'Module One',
    lazy: false,
    components: [{
      timer: 1000,
    }, {
      timer: 2000
    }]
  }, {
    title: 'Module Two',
    lazy: true,
    components: [{
      timer: 1000
    }]
  }, {
    title: 'Module Three',
    lazy: true,
    components: [{
      timer: 500,
    }, {
      timer: 800
    }, {
      timer: 2500
    }]
  }]
  export default {
    components: {
      UiLayout,
      ModuleComp
    },
    data() {
      return {
        config,
        storeModuleName: uniqid.time()
      }
    },
    created() {
      store.registerModule(this.storeModuleName, {
        namespaced: true,
        state: {
          firstFetch: 0
        },
        mutations: {
          init_restFetch(state, value) {
            state.firstFetch = value
          },
          refresh_restFetch(state) {
            state.firstFetch = state.firstFetch - 1
          }
        }
      })
      // 统计所有首屏的fetch数量
      const firstTotalFetch = this.config.filter(layout => !layout.lazy).reduce((pre, { components }) => pre + components.length, 0)
      this.$store.commit(`${this.storeModuleName}/init_restFetch`, firstTotalFetch)
    },
    destroyed() {
      store.unregisterModule(this.storeModuleName)
    }
  }
</script>

<style lang="less">
  .dynamic-page {
    margin: 30px;
    display: flex;
    flex-flow: column;
    align-items: center;
    
    .ui-layout {
      margin-bottom: 40px;
    }
  }
</style>