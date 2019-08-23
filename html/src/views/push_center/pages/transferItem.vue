<template>
  <span class="item">
    {{label}}
    <span class="btn-block" v-show="isActive === 0">
      <i @click.stop="trash(val)" class="icon-trash-empty"></i>
    </span>
  </span>
</template>
<script>
  export default {
    name: 'transferItem',
    props: {
      val: {
        type: String
      },
      label: {
        type: String
      },
      isActive: {
        type: Number
      },
      parent: {
        type: String
      }
    },
    methods: {
      trash (val) {
        this.$emit('trash', val);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .item
    display:inline-block
    width: 90%
    .btn-block
      float: right
      display: none
      i
        padding: 2px 6px
        border: 1px solid #ccc
  .item:hover
    .btn-block
      display: inline-block
</style>

