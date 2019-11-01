<template>
  <div class="ui-layout">
    <div class="ui-layout-header">
      <p class="title">{{ title || 'Title' }}</p>
    </div>
    <div class="ui-layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      lazy: {
        type: Boolean,
        default: false
      },
      storeModuleName: String
    },
    mounted() {
      if (!this.lazy) {
       this.triggerChildFetch()
      }
    },
    computed: {
      firstFetch() {
        return this.$store.state[this.storeModuleName]?.firstFetch
      }
    },
    watch: {
      firstFetch(newVal) {
        if (newVal === 0 && this.lazy) {
          this.triggerChildFetch()
        }
      }
    },
    methods: {
      triggerChildFetch() {
        this.$children.forEach(child => {
          if (child.$observer) {
            child.$observer.subscribe({
              next: () => {},
              complete: () => this.$store.commit(`${this.storeModuleName}/refresh_restFetch`)
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .ui-layout {
    min-height: 300px;
    box-shadow: 0 0 10px 10px #eee;
    width: 70vw;

    &-header {
      padding: 20px;
      text-align: left;
      border-bottom: 1px solid #eee;

      .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 0px;
      }
    }

    &-content {
      padding: 20px;
    }
  }
</style>