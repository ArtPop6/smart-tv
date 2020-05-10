<template>
  <div>
    <a-modal
      :maskClosable="maskClosable"
      :title="title"
      @cancel="onCancel"
      @ok="handleOk"
      cancelText="取消"
      okText="确认"
      v-model="visible"
      width="420px"
      wrapClassName="department-edit"
    >
      <div class="departmentName" v-show="move">
        <span class="depart">部门名称:</span>
        <a-input maxlength="50" placeholder="最多输入50个字符" v-model="inputValue" />
      </div>
      <div class="superior">
        <span class="sup-depart">上级部门:</span>
        <a-tree-select
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          :value="value"
          @change="onChange"
          allowClear
          placeholder="请选择上级部门"
          style="width: 310px"
          treeDefaultExpandAll
        >
          <a-icon slot="suffixIcon" type="smile" />
        </a-tree-select>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'departModal',
  props: ['visibleList', 'titleList', 'moveList', 'addSign', 'selectedList', 'parentKey', 'sendSeleKeys'],
  data() {
    return {
      treeData: [],
      title: '',
      visible: false,
      maskClosable: false,
      move: true,
      selectedKeys: 0, // 选择的部门Key
      value: '',
      inputValue: ''
    }
  },
  watch: {
    visibleList(newValue, oldValue) {
      this.visible = newValue
      this.inputValue = ''
    },
    titleList(newValue, oldValue) {
      this.title = newValue
    },
    moveList(newValue, oldValue) {
      this.move = newValue
    },
    addSign(newValue, oldValue) {
      // console.log(newValue, this.addSign);
    },
    // 根据不同的操作来选择上级部门下拉框默认渲染的key的Keys
    sendSeleKeys(newValue, oldValue) {
      this.value = newValue
    },
    // 要操作的部门,作为接口参数
    selectedList(newValue, oldValue) {
      this.selectedKeys = newValue[0]
    }
  },
  methods: {
    handleOk(e) {
      this.visible = false
      if (this.move === false) {
        // 移动部门
        this.moveDepartment()
      } else if (this.addSign === true) {
        if (this.inputValue === '') {
          this.visible = true
          this.$message.warning('请输入名称')
          return
        }
        // 添加部门
        this.addDepartment()
      } else {
        if (this.inputValue === '') {
          this.visible = true
          this.$message.warning('请输入需要更改的名称')
          return
        }
        // 编辑部门
        this.editDepartment()
      }
      setTimeout(() => {
        this.move = true
        this.$emit('getVisible', this.visible, this.move)
      }, 100)
    },
    onCancel(e) {
      this.visible = false
      this.inputValue = ''
      this.value = this.sendSeleKeys
      this.move = true
      this.$emit('getVisible', this.visible, this.move)
    },
    onChange(value) {
      this.value = value
    },
    moveDepartment() {
      const moveUrl = './departments'
      const data = {
        id: this.selectedKeys,
        root_id: this.value
      }
      this.$http.put(moveUrl, data).then(res => {
        this.$message.success('移动部门成功')
        // this.value = this.sendSeleKeys
        this.$emit('getNewParentKey', this.value)
        this.getDepartmentTree()
      })
    },
    addDepartment() {
      const url = './departments'
      const data = {
        root_id: this.value,
        name: this.inputValue
      }
      this.$http
        .post(url, data)
        .then(res => {
          this.value = this.sendSeleKeys
          this.$message.success('添加部门成功')
          this.getDepartmentTree()
        })
        .catch(err => {
          console.log(err)
        })
    },
    editDepartment() {
      const url = './departments'
      const data = {
        id: this.selectedKeys,
        root_id: this.value,
        name: this.inputValue
      }
      this.$http
        .put(url, data)
        .then(res => {
          this.value = this.sendSeleKeys
          this.$message.success('编辑部门成功')
          this.getDepartmentTree()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDepartmentTree() {
      const url = './departments'
      this.$http
        .get(url)
        .then(res => {
          // 通过title来判断是初始化渲染数据，还是改变数据后向父组件传值
          if (this.title === '') {
            this.treeData = res.data
            return
          }
          this.treeData = res.data
          this.$emit('getNewTree', this.treeData)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.title = this.titleList
    this.getDepartmentTree()
  }
}
</script>

<style lang="stylus">
.department-edit
  .ant-modal-content
    border 0
    border-radius 5px
    background-clip padding-box
    box-shadow 0 0 0 rgba(0, 0, 0, 0)

    .ant-modal-body
      .departmentName
        display flex
        margin-bottom 12px

        span.depart
          white-space nowrap
          margin-right 10px
          padding-top 5px

        .ant-input
          width 310px

      .superior
        display flex

        span.sup-depart
          white-space nowrap
          margin-right 10px
          padding-top 4px
</style>