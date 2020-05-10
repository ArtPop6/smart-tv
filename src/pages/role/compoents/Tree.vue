<template>
  <a-tree
    :selectedKeys="selectedKeys"
    :treeData="treeData"
    @select="onSelect"
    checkable
    defaultExpandAll
    v-if="treeData.length"
    v-model="checkedKeys"
  />
</template>
<script>
export default {
  props: ['treeid', 'roleIds', 'savess'],
  data() {
    return {
      checkedKeys: [], //默认选中的节点
      selectedKeys: [],
      treeData: []
    }
  },
  watch: {
    checkedKeys(val) {
      this.$emit('checkdKey', val)
    },
    treeid(v) {
      this.list()
    },
    savess(v) {
      this.save()
    }
  },
  methods: {
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    list() {
      this.$nextTick(function() {
        const roleData = {
          role_id: this.treeid
        }
        this.$http.get(`/role/function`, { params: roleData }).then(res => {
          this.treeData = res.data.function_tree
          this.checkedKeys = res.data.check_ids
        })
      })
    },
    save() {
      this.$nextTick(function() {
        const roleData = {
          role_id: this.roleIds
        }
        this.$http.get(`/role/function`, { params: roleData }).then(res => {
          this.treeData = res.data.function_tree
          this.checkedKeys = res.data.check_ids
        })
      })
    }
  }
}
</script>
