<template>
  <a-modal
    :maskClosable="closable"
    :title="title"
    @cancel="onCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="提交"
    v-model="visible"
  >
    <a-form :form="form">
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="姓名">
        <a-input placeholder="请输入姓名" v-decorator="['name', configName]" />
      </a-form-item>

      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="手机号" v-show="this.editSign === 'add'">
        <a-input placeholder="请输入手机号" v-decorator="['mobile', configPhone]" />
      </a-form-item>

      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="部门">
        <a-tree-select
          :treeData="treeData"
          allowClear
          multiple
          placeholder="请选择部门"
          treeDefaultExpandAll
          v-decorator="['department_id', configDepart]"
        ></a-tree-select>
        <!-- TODO 编辑部门初始化多选没有"X"符号 -->
        <!-- @change="onChange" -->
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const treeDatas = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0'
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1'
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2'
      }
    ]
  }
]
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'addMember',
  props: {
    newMember: Boolean,
    treeData: Array,
    editVisible: Boolean,
    seleName: String,
    selePhone: String,
    seleDepart: Array,
    addTitle: String,
    editSign: String,
    seleKey: Number
  },
  data() {
    return {
      title: '',
      configName: {
        initialValue: '',
        rules: [{ required: true, message: '请输入姓名!' }, { max: 10, message: '限制10字符内' }]
      },
      configPhone: {
        initialValue: '',
        rules: [{ required: true, message: '请输入手机号' }]
      },
      configDepart: {
        initialValue: null,
        rules: [{ required: true, message: '请选择部门' }]
      },
      nameValue: '',
      roleOptions: [], // 获取全部角色
      checkedList: [],
      departValue: [],
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      strict: false,
      closable: false,
      phoneValue: 157,
      editName: '',
      editPhone: '',
      editDepart: [],
      initialEdit: '',
      editKey: 0,
      treeDatas
    }
  },
  watch: {
    newMember(newValue) {
      this.visible = newValue
    },
    value(value) {
      console.log(value)
    },
    seleName(newValue) {
      this.editName = newValue
    },
    selePhone(newValue) {
      this.editPhone = newValue
    },
    seleDepart(newValue) {
      this.editDepart = newValue
    },
    seleKey(newValue) {
      this.editKey = newValue
    },
    addTitle(newValue) {
      this.title = newValue
    },
    editVisible(newValue) {
      this.visible = newValue
    },
    editSign(newValue) {
      const that = this
      setTimeout(() => {
        if (newValue === 'edit') {
          that.form.setFieldsValue({
            name: that.seleName,
            mobile: that.selePhone,
            department_id: that.seleDepart
          })
        } else if (newValue === 'add') {
          that.form.setFieldsValue({
            name: '',
            mobile: '',
            department_id: null
          })
        }
      }, 100)
    }
  },
  methods: {
    handleOk(e) {
      if (this.editSign === 'edit') {
        const data = this.form.getFieldsValue()
        data['id'] = this.editKey
        delete data.mobile
        this.$http
          .put('./staffs', data)
          .then(res => {
            this.$message.success('编辑员工成功')
            this.visible = false
            this.$emit('addVisible', this.visible, this.initialEdit)
          })
          .catch(err => {
            console.log(err)
            this.visible = true
            this.$message.error(err.response.data.err_msg)
          })
        return
      }
      if (this.editSign === 'add') {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http
              .post('./staffs', values)
              .then(res => {
                this.$message.success('新增员工成功')
                this.form.setFieldsValue({
                  name: '',
                  mobile: '',
                  department_id: null
                })
                this.visible = false
                this.$emit('addVisible', this.visible, this.initialEdit)
              })
              .catch(err => {
                console.log('错误信息', err.response.data)
                this.visible = true
                this.$message.error(err.response.data.err_msg)
              })
          }
        })
        return
      }
    },
    onCancel() {
      this.visible = false
      this.form.setFieldsValue({
        name: '',
        mobile: '',
        department_id: null
      })
      this.$emit('cancelVisible', this.visible, this.initialEdit)
    },
    roleChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.roleOptions.length
      this.checkAll = checkedList.length === this.roleOptions.length
    },
    onChange(checkedKeys, info) {
      this.form.setFieldsValue({
        department_id: checkedKeys
      })
      this.departValue = checkedKeys
      this.value = checkedKeys
    }
  },
  mounted() {}
}
</script>

<style lang="stylus">
.ant-select-tree-dropdown
  z-index 100000

  .ant-select-tree li .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected
    background-color #1890ff
    color #fff

  .ant-select-tree li .ant-select-tree-node-content-wrapper
    padding 6px 6px 6px 18px
    border-radius 6px
</style>