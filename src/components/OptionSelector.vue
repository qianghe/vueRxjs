<template>
  <div class="option-selector">
    <span v-if="label">{{ label }}</span>
    <a-select :value="value" @change="handleChange" style="width: 100px">
      <a-select-option
        v-for="(option, key) in options"
        :key="key"
        :value="option.id"
      >{{option.name}}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import { Select } from 'ant-design-vue'

const { Option: SelectOption } = Select

export default {
  components: {
    'ASelect': Select,
    'ASelectOption': SelectOption
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String , Number]
    },
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleChange(value) {
      if (this.onChange) {
        this.onChange(value)
      }
    }
  }
}
</script>

<style lang="less">
  .option-selector {
    margin: 10px 0;
    > span {
      color: #666;
      margin-right: 10px;
    }
  }
</style>