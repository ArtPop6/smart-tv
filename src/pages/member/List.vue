<template>
  <div class="member-pad">
    <div class="member-wrap">
      <div class="member-list">
        <div class="department-tree">
          <!-- 增加，编辑，移动部门的弹窗组件 -->
          <DepartModal
            :addSign="this.addSign"
            :moveList="this.move"
            :parentKey="this.parentKey"
            :selectedList="this.selectedKeys"
            :sendSeleKeys="this.sendSeleKeys"
            :titleList="this.title"
            :visibleList="this.operationVisible"
            @getNewParentKey="getNewParentKey"
            @getNewTree="getNewTree"
            @getVisible="getVisible"
          />
          <AddMember
            :addTitle="addTitle"
            :editSign="editSign"
            :editVisible="editVisible"
            :newMember="memberAdd"
            :seleDepart="seleDepart"
            :seleKey="seleKey"
            :seleName="seleName"
            :selePhone="selePhone"
            :treeData="this.treeData"
            @addVisible="addVisible"
            @cancelVisible="cancelVisible"
          />
          <WechatWork
            :importVisible="importVisible"
            @disableButton="disableButton"
            @wechatVisible="wechatVisible"
            @weTreeData="weTreeData"
          />
          <div class="operation">
            <!-- 添加子部门按钮 -->
            <a-tooltip v-if="authority.authority[39] ? authority.authority[39].enable : false">
              <!-- <a-tooltip v-if="false"> -->
              <template slot="title">添加子部门</template>
              <a-icon
                :style="iconStyle"
                :twoToneColor="
                  selectedKeys.length && this.success === false
                    ? '#1890ff'
                    : '#afafaf'
                "
                @click="add()"
                theme="twoTone"
                type="plus-square"
              />
            </a-tooltip>
            <!-- 编辑部门 -->
            <a-tooltip v-if="authority.authority[40] ? authority.authority[40].enable : false">
              <!-- <a-tooltip v-if="false"> -->
              <template slot="title">编辑部门</template>
              <a-icon
                :style="iconStyle"
                :twoToneColor="
                  selected === false &&
                  selectedKeys.length &&
                  this.success === false
                    ? '#1890ff'
                    : '#afafaf'
                "
                @click="editDepart()"
                theme="twoTone"
                type="edit"
              />
            </a-tooltip>
            <!-- 移动部门 -->
            <a-tooltip v-if="authority.authority[41] ? authority.authority[41].enable : false">
              <!-- <a-tooltip v-if="false"> -->
              <template slot="title">移动部门</template>
              <a-icon
                :style="iconStyle"
                :twoToneColor="
                  selected === false &&
                  selectedKeys.length &&
                  this.success === false
                    ? '#1890ff'
                    : '#afafaf'
                "
                @click="moveDepart()"
                theme="twoTone"
                type="interation"
              />
            </a-tooltip>
            <!-- 删除部门 -->
            <a-tooltip v-if="authority.authority[42] ? authority.authority[42].enable : false">
              <!-- <a-tooltip v-if="false"> -->
              <template slot="title">删除部门</template>
              <a-icon
                :style="iconStyle"
                :twoToneColor="
                  selected === false &&
                  selectedKeys.length &&
                  this.success === false
                    ? '#1890ff'
                    : '#afafaf'
                "
                @click="removeDepart()"
                theme="twoTone"
                type="delete"
              />
            </a-tooltip>
          </div>

          <div class="tree-part">
            <a-tree
              :defaultExpandAll="defaultExpandAll"
              :defaultSelectedKeys="defaultKeys"
              :treeData="treeData"
              @select="onSelect"
              showLine
              v-if="treeData.length"
            >
              <a-icon slot="cluster" type="cluster-o" />
            </a-tree>
          </div>
        </div>
        <div class="member-table">
          <div class="top-part">
            <!-- 搜索框 -->
            <div class="search-bar">
              <a-input-search @search="onSearch" enterButton placeholder="搜索姓名、手机号" style="width: 268px" />
            </div>
            <div class="button-group">
              <a-tag :color="success ===true? 'cyan': 'orange'">
                {{
                success === true
                ? "已绑定企业微信：AMPM无竞悦动"
                : "暂未绑定企业微信"
                }}
              </a-tag>
              <a-button
                :class="[success === true ? 'untie' : 'import']"
                :disabled="disabled"
                :loading="loading"
                @click="wechatImport()"
                class="enterprise"
                v-if="showButton"
              >{{ success === true ? "企微同步" : "企微导入" }}</a-button>
              <a-button
                :class="[success === true ? 'disable-add' : 'able-add']"
                :disabled="disabledAll"
                @click="newMember"
                class="new-member"
                v-if="authority.authority[44] ? authority.authority[44].enable : false"
              >新增账号</a-button>
            </div>
          </div>

          <div class="table">
            <!-- 配置权限弹窗 -->
            <a-modal
              :bodyStyle="bodyStyle"
              :maskClosable="maskClosable"
              :title="bigTitle"
              @ok="handleOk"
              cancelText="取消"
              okText="保存"
              v-model="memberVisible"
              width="600px"
              wrapClassName="custom-modal"
            >
              <div class="role" style="width: 275px">
                <p class="role-title">通过角色快速配置</p>
                <div>
                  <div
                    :style="{
                      paddingBottom: '10px',
                      borderBottom: '1px solid #E9E9E9'
                    }"
                  >
                    <a-checkbox :checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">可分配的角色</a-checkbox>
                  </div>
                  <br />
                  <div class="role-config">
                    <a-col :span="10">
                      <a-checkbox-group :options="roleOptions" @change="onChange" v-model="checkedList" />
                    </a-col>
                  </div>
                </div>
              </div>

              <div class="tree" style="width: 275px">
                <p class="tree-part">该用户的最终权限树</p>
                <div class="tree-config">
                  <a-tree
                    :autoExpandParent="autoExpandParent"
                    :defaultExpandAll="defaultExpandAll"
                    :treeData="permissionTreeData"
                    @check="onCheck"
                    checkable
                    v-if="permissionTreeData.length"
                    v-model="checkedKeys"
                  />
                </div>
              </div>
            </a-modal>

            <a-table :columns="columns" :dataSource="memberData" :pagination="pagination" @change="pageChange">
              <template slot="operation" slot-scope="text, record">
                <a
                  @click="configAuth(record)"
                  v-if="authority.authority[45] ? authority.authority[45].enable : false"
                >配置权限</a>

                <a-divider type="vertical" v-if="authority.authority[45] ? authority.authority[45].enable : false" />

                <a
                  @click="confirm(record)"
                  cancelText="取消"
                  okText="确认"
                  v-if="authority.authority[46] ? authority.authority[46].enable : false"
                >重置密码</a>

                <a-divider type="vertical" v-if="authority.authority[46] ? authority.authority[46].enable : false" />

                <a-button
                  :disabled="disabledAll"
                  @click="adjust(record)"
                  class="ant-dropdown-link"
                  type="link"
                  v-if="authority.authority[47] ? authority.authority[47].enable : false"
                >编辑账号</a-button>

                <a-divider type="vertical" v-if="authority.authority[47] ? authority.authority[47].enable : false" />

                <a-button
                  :class="[
                    record.status === 1 ? 'disable-account' : 'start-account',
                    disabledAll === true ? 'disabled' : 'abled'
                  ]"
                  :disabled="disabledAll"
                  @click="configAccount(record)"
                  type="link"
                  v-if="authority.authority[48] ? authority.authority[48].enable : false"
                >{{ record.status === 1 ? "禁用账号" : "启用账号" }}</a-button>

                <a-divider type="vertical" v-if="authority.authority[48] ? authority.authority[48].enable : false" />

                <a-button
                  :disabled="disabledAll"
                  @click="deleteAccount(record)"
                  type="link"
                  v-if="authority.authority[49] ? authority.authority[49].enable : false"
                >删除</a-button>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DepartModal from './components/departModal'
import AddMember from './components/addMember'
import WechatWork from './components/wechatWork'
import './list.stylus'

const treeData = []
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: '15%'
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: '17%'
  },
  {
    title: '职位',
    dataIndex: 'job_name',
    key: 'job_name',
    width: '17%'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '50%',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  components: {
    DepartModal,
    AddMember,
    WechatWork
  },
  data() {
    return {
      memberAdd: false, // 新增账号弹窗的显示与否
      editVisible: false, // 编辑账号弹窗的显示与否
      addTitle: '',
      editSign: '', // 判断弹出框是编辑框还是新增框
      sendSeleKeys: '',
      customize: false,
      parentKey: '',
      success: false,
      defaultKeys: [],
      selected: false,
      selectedKeys: [],
      memberData: [],
      columns,
      count: 2,
      expandedKeys: [],
      autoExpandParent: true,
      defaultExpandAll: true,
      checkedKeys: [], // 配置权限树时勾选的选项
      treeData,
      permissionTreeData: [],
      memberVisible: false, // 配置权限弹窗的显示与否
      operationVisible: false,
      title: '',
      bodyStyle: {
        maxHeight: '660px'
        // overflow: "auto"
      },
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      roleOptions: [],
      iconStyle: {
        fontSize: '20px',
        marginRight: '6px'
      },
      move: true,
      memberList: [],
      addSign: '',
      treeVisible: false,
      importVisible: false,
      seleName: '',
      selePhone: '',
      seleDepart: [],
      seleKey: 0,
      // deptKey: 0,
      staffId: 0,
      search: false,
      searchValue: '',
      disabled: false,
      loading: false,
      disabledAll: false,
      maskClosable: false,
      checkedRole: [],
      allFunc: [],
      checkedPerm: [],
      allFuncsOfRole: [],
      pagination: {
        pageSize: 10, // 一页的数据限制
        current: 1, // 当前页
        total: 0, // 总数
        hideOnSinglePage: false, // 只有一页时是否隐藏分页器
        showQuickJumper: false, // 是否可以快速跳转至某页
        showSizeChanger: false, // 是否可以改变 pageSize
        pageSizeOptions: ['5', '10', '30'], // 指定每页可以显示多少条
        showTotal: total => `共 ${total}人` // 可以展示总数
      }
    }
  },
  computed: {
    bigTitle: function() {
      return '账号 ' + this.title + ' 的权限配置'
    },
    ...mapState(['authority']),
    showButton: function() {
      if (this.success === true) {
        return this.authority.authority[57] ? this.authority.authority[57].enable : false
      }
      if (this.success === false) {
        return this.authority.authority[56] ? this.authority.authority[56].enable : false
      }
    }
  },
  methods: {
    // 增加部门
    add() {
      if (!this.selectedKeys.length) {
        this.$message.warning('请选择正确的部门')
      } else if (this.success === true) {
        this.$message.warning('企微绑定后不可操作')
      } else {
        this.sendSeleKeys = this.selectedKeys[0].toString()
        this.operationVisible = true
        this.title = '新增子部门'
        this.addSign = true
      }
    },
    // 编辑部门
    editDepart() {
      if (this.success === true) {
        this.$message.warning('企微绑定后不可操作')
      } else if (this.selected === true || !this.selectedKeys.length) {
        this.$message.warning('请选择正确的部门')
      } else {
        // 下拉框选择上级部门
        this.sendSeleKeys = this.parentKey
        this.operationVisible = true
        this.title = '编辑部门'
        this.addSign = false
      }
    },
    // 移动部门
    moveDepart() {
      if (this.success === true) {
        this.$message.warning('企微绑定后不可操作')
      } else if (this.selected === true || !this.selectedKeys.length) {
        this.$message.warning('请选择正确的部门')
      } else {
        // 让下拉框选择上级
        this.sendSeleKeys = this.parentKey
        this.operationVisible = true
        this.title = '移动部门'
        this.move = false
      }
    },
    // 删除部门
    removeDepart() {
      if (this.success === true) {
        this.$message.warning('企微绑定后不可操作')
      } else if (this.selected === true || !this.selectedKeys.length) {
        this.$message.warning('请选择正确的部门')
      } else {
        const that = this
        this.$confirm({
          okText: '确定',
          cancelText: '取消',
          title: '确认删除该部门吗',
          content: '删除后，该部门下的所有人员将会自动移到上一级部门下。',
          onOk() {
            const url = './departments'
            const data = {
              id: that.selectedKeys[0]
              // id: that.defaultKeys[0]
            }
            that.$http
              .delete(url, { params: data })
              .then(res => {
                that.selectedKeys = []
                that.getDepartmentTree()
                that.memberData = []
              })
              .catch(err => {
                console.log(err)
              })
          },
          onCancel() {}
        })
      }
    },
    // 增加，编辑，移动部门组件，实时更新visible的值，watch
    getVisible(visible, move) {
      this.operationVisible = visible
      this.move = move
    },
    getTreeVisible(visible) {
      this.treeVisible = visible
    },
    getNewMembers(members) {
      this.memberData = members
    },
    addVisible(v, e) {
      this.memberAdd = v
      this.editVisible = v
      this.editSign = e
      if (v === false) {
        if (this.search === true) {
          this.getSearchMembers()
        } else if (this.search === false) {
          this.getMembers()
        }
      }
    },
    cancelVisible(v, e) {
      this.memberAdd = v
      this.editSign = e
      this.editVisible = v
    },

    // 配置权限点击事件
    configAuth(record) {
      this.getAllFunc()
      this.checkedPerm = []
      this.memberVisible = true
      this.title = record.name
      // 获取对应职员角色
      this.staffId = record.key
      const roleUrl = './staffs/roles'
      const data = {
        staff_id: this.staffId
      }
      this.$http
        .get(roleUrl, { params: data })
        .then(res => {
          this.checkedList = res.data.check_ids
          this.roleOptions = res.data.staff_role_dtos
        })
        .catch(err => {
          console.log(err)
        })
      const permissionUrl = './staffs/permission'
      const authData = {
        staff_id: this.staffId
      }
      this.$http
        .get(permissionUrl, { params: authData })
        .then(res => {
          this.checkedKeys = res.data.check_ids
          this.permissionTreeData = res.data.function_tree
        })
        .catch(err => {
          console.log(err)
        })
    },
    // arr1数组中删除arr2数组方法
    removeArray(arr1, arr2) {
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr2[i] == arr1[j]) {
            let indexs = arr1.indexOf(arr1[j])
            arr1.splice(indexs, 1)
          }
        }
      }
    },
    // 配置角色的函数
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.roleOptions.length
      this.checkAll = checkedList.length === this.roleOptions.length
      // 每次重新获得左边点选的角色对应的权限而不是增加操作
      this.checkedRole = []
      for (let i = 0; i < checkedList.length; i++) {
        for (let j = 0; j < this.allFunc.length; j++) {
          if (this.allFunc[j].role_id === checkedList[i]) {
            this.checkedRole = this.checkedRole.concat(this.allFunc[j].role_funcs)
          }
        }
      }
      this.checkedKeys = this.checkedPerm.concat(this.checkedRole)
    },
    // 配置角色时全选按钮函数
    onCheckAllChange(e) {
      let arr = []
      for (let i = 0; i < this.roleOptions.length; i++) {
        arr.push(this.roleOptions[i].value)
      }
      Object.assign(this, {
        checkedList: e.target.checked ? arr : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      if (e.target.checked === false) {
        this.removeArray(this.checkedKeys, this.allFuncsOfRole)
        return
      }
      if (e.target.checked === true) {
        this.checkedKeys = this.checkedKeys.concat(this.allFuncsOfRole)
        return
      }
    },
    // 配置权限树点击函数
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys
      if (info.checked === true) {
        this.checkedPerm = this.checkedPerm.concat([info.node.eventKey])
        return
      }
      if (info.checked === false) {
        this.removeArray(this.checkedPerm, [info.node.eventKey])
        return
      }
    },
    onSearch(value, e) {
      this.search = true
      this.searchValue = value
      this.pagination.current = 1
      this.getSearchMembers()
    },
    handleOk(e) {
      const url = './staffs/permission'
      const data = {
        staff_id: this.staffId,
        staff_role: this.checkedList,
        staff_func: this.checkedKeys
      }
      this.$http
        .post(url, data)
        .then(res => {
          this.$message.success('配置权限成功')
        })
        .catch(err => {
          console.log(err)
        })
      this.memberVisible = false
    },
    confirm(record) {
      const that = this
      this.$confirm({
        title: `确认重置 ${record.name} 的密码吗?`,
        content: '重置后，密码将初始化，初始密码为88888888。',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const url = './staffs/password'
          const data = {
            staff_id: record.key
          }
          that.$http.post(url, data).then(res => {
            that.$message.success(`账号 ${record.name} 的密码重置成功`)
          })
        },
        onCancel() {}
      })
    },
    adjust(record) {
      setTimeout(() => {
        this.editSign = 'edit'
      }, 100)
      this.seleName = record.name
      this.selePhone = record.phone
      this.seleDepart = record.departments_id
      this.seleKey = record.key
      this.editVisible = true
      this.addTitle = '编辑账号'
    },
    // 部门树节点点击事件
    onSelect(selectedKeys, info) {
      this.pagination.current = 1
      this.selectedKeys = selectedKeys
      this.search = false
      if (this.selectedKeys[0] === this.treeData[0].key) {
        this.selected = true
      } else {
        this.selected = false
      }
      if (this.selectedKeys.length === 0) {
        return false
      } else {
        this.parentKey = info.selectedNodes[0].data.props.dataRef.parent_key
        this.getMembers()
      }
    },
    getMembers() {
      const url = './staffs/departments'
      const data = {
        id: this.selectedKeys[0],
        page: this.pagination.current,
        size: 10
      }
      this.$http
        .get(url, { params: data })
        .then(res => {
          this.pagination.total = res.data.total
          this.memberData = res.data.items
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSearchMembers() {
      const url = './staffs/queries'
      this.selectedKeys.length = 0
      const data = {
        query: this.searchValue,
        page: this.pagination.current,
        size: 10
      }
      this.$http
        .get(url, { params: data })
        .then(res => {
          this.memberData = res.data.items
          this.pagination.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    wechatImport() {
      this.disabled = true
      if (this.success === false) {
        const that = this
        this.$confirm({
          class: 'wechat-bind',
          width: '500px',
          title: '注意!',
          content: {
            tag: 'div',
            attributes: {
              id: 'main'
            },
            children: [
              {
                tag: 'p',
                data: { class: 'wetip1' },
                text: '1. 当前平台已有数据，绑定企业微信后将以企业微信通讯录为准,本地数据将被删除。'
              },
              {
                tag: 'p',
                data: { class: 'wetip2' },
                text: '2. 绑定后将不能进行编辑、禁用、删除人员，以及部门的相关操作。'
              }
            ]
          },
          okText: '确认',
          cancelText: '取消',
          onOk() {
            that.importVisible = true
            that.disabled = false
          },
          onCancel() {
            that.disabled = false
          }
        })
      } else if (this.success === true) {
        // 直接请求同步接口
        this.loading = true
        const url = './staffs/wework'
        this.$http
          .get(url)
          .then(res => {
            this.disabled = false
            this.loading = false
            this.$message.success('同步企业微信成功')
            this.disabledAll = true
            this.getMembers()
            this.getDepartmentTree()
          })
          .catch(err => {
            this.$message.error(err.response.data.err_msg)
            this.loading = false
            this.disabled = false
          })
      }
    },
    newMember() {
      this.memberAdd = true
      this.addTitle = '新增账号'
      this.editSign = 'add'
    },
    configAccount(record) {
      if (record.status === 1) {
        const that = this
        this.$confirm({
          title: `确认禁用账号 ${record.name} 吗`,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            const url = './staffs/status'
            const data = {
              staff_id: record.key
            }
            that.$http
              .delete(url, { params: data })
              .then(res => {
                record.status = 0
                that.$message.success(`禁用账号 ${record.name} 成功`)
              })
              .catch(err => {
                console.log(err)
              })
          },
          onCancel() {}
        })
      } else {
        const that = this
        this.$confirm({
          title: `确认启用账号 ${record.name} 吗`,
          // content: "解绑后，已导入的人员将不会被删除",
          okText: '确认',
          cancelText: '取消',
          onOk() {
            const url = './staffs/status'
            const data = {
              staff_id: record.key
            }
            that.$http
              .post(url, data)
              .then(res => {
                record.status = 1
                that.$message.success(`启用账号 ${record.name} 成功`)
              })
              .catch(err => {
                console.log(err)
              })
          },
          onCancel() {}
        })
      }
    },
    deleteAccount(record) {
      const that = this
      this.$confirm({
        title: `确认删除账号 ${record.name} 吗`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const data = {
            staff_id: record.key
          }
          that.$http
            .delete('./staffs', { params: data })
            .then(res => {
              that.$message.success('删除成功')
              // 判断是否是在搜索页表格中做的删除操作
              if (that.search === false) {
                const url = './staffs/departments'
                const newData = {
                  id: that.selectedKeys[0],
                  page: that.pagination.current,
                  size: 10
                }
                that.$http
                  .get(url, { params: newData })
                  .then(res => {
                    if (that.pagination.current !== 1 && res.data.empty === true) {
                      that.pagination.current = that.pagination.current - 1
                      that.getMembers()
                    } else if (res.data.empty === false) {
                      that.pagination.total = res.data.total
                      that.memberData = res.data.items
                    } else if (that.pagination.current === 1 && res.data.empty === true) {
                      that.memberData = res.data.items
                      that.pagination.total = res.data.total
                    }
                  })
                  .catch(err => {
                    that.$message.error(err.response.data.err_msg)
                    console.log(err)
                  })
              } else if (that.search === true) {
                const url = './staffs/queries'
                const searchData = {
                  query: that.searchValue,
                  page: that.pagination.current,
                  size: 10
                }
                that.$http
                  .get(url, { params: searchData })
                  .then(res => {
                    // 当前页数据为第一页，且删除后数据为空
                    if (that.pagination.current !== 1 && res.data.empty === true) {
                      that.pagination.current = that.pagination.current - 1
                      that.getSearchMembers()
                    } else if (res.data.empty === false) {
                      that.pagination.total = res.data.total
                      that.memberData = res.data.items
                    } else if (that.pagination.current === 1 && res.data.empty === true) {
                      that.memberData = res.data.items
                      that.pagination.total = res.data.total
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
            .catch(err => {
              console.log(err)
              that.$message.error('删除失败')
            })
        },
        onCancel() {}
      })
    },
    pageChange(page) {
      this.pagination.current = page.current
      if (this.search === true) {
        this.getSearchMembers()
      } else if (this.search === false) {
        this.getMembers()
      }
    },
    getDepartmentTree() {
      const url = './departments'
      return this.$http
        .get(url)
        .then(res => {
          this.treeData = res.data
          return res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getNewTree(data) {
      this.treeData = data
      this.getMembers()
    },
    getNewParentKey(p) {
      this.parentKey = p
    },
    wechatVisible(v, s) {
      this.importVisible = v
      this.success = s
    },
    disableButton(d) {
      this.disabledAll = d
    },
    weTreeData(t) {
      this.treeData = t
      this.getMembers()
    },
    getStatus() {
      this.$http
        .get('./staffs/wxstatus')
        .then(res => {
          this.success = res.data.wx_syn
          if (res.data.wx_syn === true) {
            this.disabledAll = true
          } else if (res.data.wx_syn === false) {
            this.disabledAll = false
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.err_msg)
        })
    },
    getAllFunc() {
      this.$http.get('./role/allfuncs').then(res => {
        this.allFunc = res.data.all_role_funcs
        this.allFuncsOfRole = res.data.all_role_func_array
      })
    }
  },
  created() {
    this.getDepartmentTree().then(() => {
      this.defaultKeys.push(this.treeData[0].key)
      this.selectedKeys.push(this.treeData[0].key)
      this.getMembers()
    })
    this.getStatus()
    this.selected = true
    // console.log(this.authority, this.authority.authority[45].enable)
  }
}
</script>