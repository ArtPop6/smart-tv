<template>
  <a-layout class="container">
    <a-layout-header class="btn-group">
      <a-row type="flex">
        <a-col :span="6">
          <router-link to="/userAdd" v-if="authority.authority[58] ? authority.authority[58].enable : false">
            <a-button icon="user-add" type="primary">新增用户</a-button>
          </router-link>
          <router-link to="/tool">
            <a-button
              icon="smile"
              type="primary"
              v-if="authority.authority[59] ? authority.authority[59].enable : false"
            >人脸识别</a-button>
          </router-link>
        </a-col>
        <a-col :span="6">
          <a-button v-if="false">导出</a-button>
        </a-col>
        <a-col :span="12">
          <a-input-search @search="handleSearch" enterButton placeholder="手机号码/客户姓名" />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="table-container">
      <a-table
        :columns="columns"
        :dataSource="rows"
        :locale="{ emptyText: '暂无数据' }"
        :pagination="pagination"
        :rowKey="record => record.id"
        @change="handleTableChange"
        size="middle"
      >
        <div slot="img" slot-scope="img, record">
          <div style="width:50px;float:left">
            <a-avatar :src="record.face_img" icon="user" shape="square" size="large" style="margin-right:10px" />
          </div>
          <div style="margin-left:5px;width:250px;">
            <div>
              <a>姓名: {{ record.name }}</a>
              <a-divider type="vertical" />
              <a-icon style="color:#1890FF" type="man" v-if="record.gender == '男'" />
              <a-icon style="color:#eb2f96" type="woman" v-if="record.gender == '女'" />
            </div>
            <div style="color:#00000073">昵称: {{ record.nick_name }}</div>
          </div>
        </div>
        <span slot="action" slot-scope="item">
          <a-popconfirm :data-id="item.id" @confirm="confirm(item.id)" cancelText="取消" okText="确定" title="确实删除面部识别吗？">
            <a
              href="javascript:void(0);"
              v-if="authority.authority[60] ? authority.authority[60].enable : false"
            >删除[Arena]权限</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
const columns = [
  {
    title: '头像',
    dataIndex: 'face_img',
    key: 'face_img',
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '注册时间',
    key: 'begin_time',
    dataIndex: 'begin_time'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'customer-list',
  data() {
    return {
      form: this.$form.createForm(this),
      rows: [],
      columns,
      page: 1,
      size: 10,
      q: '',
      pagination: {}
    }
  },
  computed: {
    ...mapState(['authority'])
  },
  methods: {
    handleCardChange(value) {
      console.log(`selected ${value}`)
    },

    handleStoreChange(value) {
      console.log(`selected ${value}`)
    },

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },

    handleSearch(valule) {
      this.q = valule
      console.log(this.q)
      this.fetchList().then(res => {
        this.filterData(res.data)
      })
    },

    fetchList() {
      const params = {
        page: this.page,
        size: this.size,
        q: this.q
      }
      return this.$http.get('/users', {
        params
      })
    },

    filterData(res) {
      this.rows = res.items
      const pagination = { ...this.pagination }
      pagination.total = res.total
      this.pagination = pagination

      this.rows = this.rows.map(item => {
        item.begin_time = this.formatDate(item.begin_time)
        item.card_end_time = this.formatDate(item.card_end_time)
        return item
      })
    },

    handleTableChange(pagination) {
      this.pagination = pagination
      this.page = pagination.current
      this.size = pagination.pageSize
      this.fetchList().then(res => {
        this.filterData(res.data)
      })
    },

    formatDate(datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      const dateTime = new Date(datetime)
      const year = dateTime.getFullYear()
      const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
      const date = ('0' + dateTime.getDate()).slice(-2)
      const hour = ('0' + dateTime.getHours()).slice(-2)
      const minute = ('0' + dateTime.getMinutes()).slice(-2)
      const second = ('0' + dateTime.getSeconds()).slice(-2)
      // 拼接
      const result = `${year}-${month}-${date}  ${hour}:${minute}:${second}`
      // 返回
      return result
    },

    handleRowDelete(id) {
      const params = {
        id
      }
      return this.$http.delete(`/entrances/member/${params.id}`)
    },

    confirm(id) {
      this.handleRowDelete(id).then(
        data => {
          this.$message.success('删除成功')
        },
        () => {
          this.$message.error('删除失败')
        }
      )
    }
  },

  mounted() {
    this.fetchList().then(res => {
      this.filterData(res.data)
    })
  }
}
</script>

<style lang="stylus">
.container
  padding 15px
  min-height 550px
  background #F0F2F5

  .btn-group
    background #fff

    button
      margin 0 10px 0 0px

  .table-container
    margin-top 10px
    background #fff

  .face_img_content
    border 0
    width 250px
    height auto
    display inline-block

    img
      width 100%
      height 100%
</style>
