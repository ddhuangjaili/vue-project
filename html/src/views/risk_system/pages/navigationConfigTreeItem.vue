<template>
  <span class="item">
    <i v-if="node.data.isNode === '0'" class="icon-folder"></i>
    <i v-if="node.data.isNode === '1'" class="icon-sticky-note"></i>
    {{node.label}}
    <span class="btn-block" v-if="type && type === 1">
      <i @click.stop="plus(node)" class="icon-plus" v-if="node.data.isNode === '0'" title="新增"></i>
      <i @click.stop="edit(node)" class="el-icon-edit" title="编辑"></i>
      <i @click.stop="trash(node)" class="icon-trash-empty" title="删除"></i>
    </span>
  </span>
</template>
<script>
  export default {
    name: 'accountTypeTreeItem',
    props: {
      node: {
        type: Object
      },
      type: {
        type: Number
      }
    },
    methods: {
      plus (node) {
        this.$emit('plus', node);
      },
      edit (node) {
        this.$emit('edit', node);
      },
      trash (node) {
        this.$emit('trash', node);
      },
      sort (node) {
        this.$emit('sort', node);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .item
    display:inline-block;
    position: relative;
    width: 90%
    .btn-block
      position: absolute;
      right: 5px;
      display: none;
      z-index: 50;
      margin-right: 10px;
      // i
        // padding: 2px 6px
      //   border: 1px solid #ccc;
      //   background: #fff;
  .item:hover
    .btn-block
      display: inline-block
</style>

