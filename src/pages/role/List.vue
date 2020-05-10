<template>
  <div class="list">
    <div class="right">
      <div class="right_top">
        <a-button
          @click="showModalAdd"
          type="primary"
          v-if="authority.authority[50] ? authority.authority[50].enable : false"
        >新增角色</a-button>
        <a-modal
          :mask="false"
          :maskClosable="false"
          @cancel="cancel"
          @ok="add"
          cancelText="取消"
          okText="确定"
          title="新增角色"
          v-model="visibleadd"
        >
          <span>角色名称：</span>
          <a-input class="name" maxlength="14" placeholder="请输入少于14字角色名称" v-model="addname" />
        </a-modal>
      </div>
      <div class="right_bottom">
        <div
          :class="index == category ? 'selected':''"
          :key="index"
          @click="select(index)"
          class="right_bottom-menu"
          v-for="(role,index) in roles"
        >
          <div @click="character(index)" class="right_bottom-name">{{role.name}}</div>
          <a-dropdown :trigger="['click']">
            <a-icon class="down_cer" type="down-circle" />
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a-button
                  @click="showModalCompile"
                  class="compile"
                  v-if="authority.authority[51] ? authority.authority[51].enable : false"
                >编辑角色</a-button>
                <a-modal
                  :mask="false"
                  :maskClosable="false"
                  @cancel="cancelcompile"
                  @ok="compile"
                  cancelText="取消"
                  okText="确定"
                  title="编辑角色"
                  v-model="visiblecompile"
                >
                  <span>角色名称：</span>
                  <a-input class="name" maxlength="14" placeholder="请输入少于14字角色名称" v-model="compilename" />
                </a-modal>
              </a-menu-item>
              <a-menu-item key="1">
                <a-button
                  @click="showModalDele"
                  v-if="authority.authority[52] ? authority.authority[52].enable : false"
                >删除角色</a-button>
                <a-modal
                  :mask="false"
                  :maskClosable="false"
                  @ok="delect(index)"
                  cancelText="取消"
                  okText="确定"
                  title="确认删除该角色吗？"
                  v-model="visibledele"
                >
                  <p class="dele">删除后，该角色下的所有成员将会变为无角色人员。</p>
                </a-modal>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="left">
      <Tabs
        :curren="curren"
        :id="id"
        :roleId="roleId"
        :saves="saves"
        @checkds="checkdsKey"
        @shows="showsd"
        class="left_tabs"
      ></Tabs>
      <button
        @click="save"
        class="left_save"
        v-if="(authority.authority[53] ? authority.authority[53].enable : false) && show"
      >保存</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tabs from './compoents/Tabs'
export default {
  components: {
    Tabs
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      visibleadd: false,
      visibledele: false,
      visiblecompile: false,
      addname: '',
      compilename: '',
      category: 0,
      roles: [],
      id: '',
      checkey: '',
      show: false,
      isRouterAlive: true,
      curren: '',
      roleId: '',
      saves: 1
    }
  },
  computed: {
    ...mapState(['authority'])
  },
  methods: {
    list() {
      this.$http.get('/role').then(res => {
        this.roles = res.data
        this.default()
      })
    },
    default() {
      this.id = this.roles[0].id
    },
    select(index) {
      this.category = index
      this.curren++
    },
    character(index) {
      this.id = this.roles[index].id
    },
    showModalAdd() {
      this.visibleadd = true
    },
    showModalDele() {
      this.visibledele = true
    },
    showModalCompile() {
      this.visiblecompile = true
    },
    // 新增取消
    cancel() {
      this.addname = ''
    },
    // 编辑取消
    cancelcompile() {
      this.compilename = ''
    },
    //新增角色
    add() {
      const addData = {
        role_name: this.addname
      }
      this.$http
        .post(`/role`, addData)
        .then(res => {
          this.visibleadd = false
          const data = res.data
          this.roles.push({
            name: this.addname,
            id: res.data.id
          })
          this.addname = ''
          this.$message.success('添加成功')
        })
        .catch(err => {
          this.visibleadd = false
        })
    },
    //编辑角色
    compile() {
      const compileData = {
        role_id: this.roles[this.category].id,
        role_name: this.compilename
      }
      this.$http
        .put(`/role`, compileData)
        .then(res => {
          this.visiblecompile = false
          const data = res.data
          this.roles[this.category].name = this.compilename
          this.compilename = ''
          this.$message.success('修改成功')
        })
        .catch(err => {
          this.visibleadd = false
        })
    },
    //删除角色
    delect(index) {
      const delectData = {
        role_id: this.roles[this.category].id
      }
      this.$http
        .delete(`/role`, { params: delectData })
        .then(res => {
          this.visibledele = false
          const data = res.data
          this.roles.splice(index, 1)
          this.$message.success('删除成功')
          this.category = 0
          this.list()
        })
        .catch(err => {
          this.visibleadd = false
        })
    },
    //保存
    save() {
      const postData = {
        role_id: this.roles[this.category].id,
        check_function_ids: this.checkey
      }
      this.$http
        .put('/role/function', postData)
        .then(res => {
          this.roleId = this.roles[this.category].id
          this.saves++
          const data = res.data
          this.$message.success('保存成功')
        })
        .catch(err => {
          this.visibleadd = false
        })
    },
    checkdsKey(checkds) {
      this.checkey = checkds
    },
    showsd(shows) {
      this.show = shows
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  created() {
    // console.log(this.authority.authority[1].enable)
    this.list()
  }
}
</script>

<style lang="stylus" scoped>
.list
  display flex
  padding 15px

.right
  display flex
  flex-direction column
  width 240px
  height 666px
  border-right 1px solid #e8e8e8

  .right_top
    display flex
    flex-direction column
    align-items center
    justify-content center
    border-bottom 1px solid #e8e8e8
    width 240px
    height 70px
    align-content center

  .right_bottom
    align-items center
    height 596px
    overflow-y auto
    overflow-x hidden
    flex-shrink 0

::-webkit-scrollbar
  width 2px
  background-color #efefef

::-webkit-scrollbar-thumb
  border-radius 3px
  background #959595

.right_bottom-menu
  display flex
  width 240px
  height 50px
  line-height 50px
  text-align center

.right_bottom-menu:hover
  color #1890ff

.selected
  color #1890ff
  background #BFEFFF

.right_bottom-name
  width 210px
  text-align center
  height 50px
  line-height 50px
  cursor pointer

.left
  width 100%
  height 710px
  align-items center

  .left_tabs
    width 100%

  .left_save
    position absolute
    width 100px
    height 36px
    top 94px
    right 50px
    text-align center
    background #1890ff
    border-radius 10px
    color #fff
    border none
    cursor pointer

.ant-btn
  height 40px
  width 160px
  border none

.name
  width 300px

.dele
  text-align center
  size 15px
  color red

.ant-dropdown-menu
  padding 0

.ant-modal-content .ant-modal-body
  height 100px
  line-height 60px

.ant-modal .ant-modal-content .ant-modal-footer
  text-align center

.down_cer
  height 50px
  width 40px
  text-align center
  line-height 54px
</style>