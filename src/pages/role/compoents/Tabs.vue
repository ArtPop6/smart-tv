<template>
  <div>
    <a-tabs @change="callback" defaultActiveKey="1">
      <a-tab-pane key="1" tab="角色成员">
        <a-table :columns="columns" :dataSource="members" :pagination="pagination" @change="handleTableChange"></a-table>
      </a-tab-pane>
      <a-tab-pane forceRender key="2" tab="功能权限">
        <Tree :roleIds="roleId" :savess="saves" :treeid="id" @checkdKey="checkd" class="tree"></Tree>
      </a-tab-pane>
      <a-tab-pane key="3" tab="数据范围">程序猿正在努力开发中......</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Tree from './Tree'
export default {
  props: ['id', 'curren', 'roleId', 'saves'],
  components: {
    Tree
  },
  data() {
    return {
      item: [],
      members: [],
      current: 1,
      searchText: '',
      searchInput: null,
      page: 1,
      checks: '',
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: '30%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: '30%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.phone
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        },
        {
          title: '部门',
          dataIndex: 'department',
          key: 'department',
          width: '30%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.department
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              })
            }
          }
        }
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showTotal: total => `共有： ${total} 人`
      }
    }
  },
  watch: {
    id(v) {
      this.list()
    },
    curren(v) {
      this.currens()
    }
  },
  methods: {
    callback(key) {
      if (key == 2) {
        this.$emit('shows', true)
      } else {
        this.$emit('shows', false)
      }
    },
    list() {
      this.$nextTick(function() {
        const tabsData = {
          role_id: this.id,
          page: 1,
          size: 10
        }
        this.$http.get(`/role/staff`, { params: tabsData }).then(res => {
          this.members = res.data.items
          this.item = res.data
          this.pagination.total = res.data.total
        })
      })
    },
    currens() {
      this.$nextTick(function() {
        this.pagination.current = 1
      })
    },
    handleTableChange(page) {
      this.pagination.current = page.current
      const tabsData = {
        role_id: this.id,
        page: page.current,
        size: 10
      }
      this.$http.get(`/role/staff`, { params: tabsData }).then(res => {
        this.members = res.data.items
        this.item = res.data
        this.pagination.total = res.data.total
      })
    },
    checkd(checkdKey) {
      this.checks = checkdKey
      this.$emit('checkds', this.checks)
    }
  },
  created() {}
}
</script>
<style lang="stylus">
.ant-tabs-bar
  margin 0

.tree
  height 600px
  overflow-y auto
  overflow-x hidden
  padding-left 30px

::-webkit-scrollbar
  width 2px
  background-color #efefef

::-webkit-scrollbar-thumb
  border-radius 3px
  background #959595

.ant-table-thead > tr > th
  transition none

.ant-tabs-nav .ant-tabs-tab
  display inline-block
  height 70px
  text-align center
  line-height 46px
  padding 12px 16px
  margin 0 32px
</style>