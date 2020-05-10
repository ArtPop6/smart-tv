<template>
  <a-layout class="container">
    <a-layout-header class="btn-group-list">
      <a-row :gutter="8" justify="space-around" type="flex">
        <a-col :span="4" align="left">
          <a-input placeholder="手机号码/客户姓名" v-model="userName" />
        </a-col>
        <a-col :span="5">
          <a-range-picker
            :defaultValue="[moment(beginDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]"
            :mode="['date', 'date']"
            :placeholder="['开始日期', '结束日期']"
            :ranges="dateRanges"
            @change="handleDateRangeChange"
            format="YYYY-MM-DD"
            locale="{locale}"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="4" align="left">
          <a-select @change="handleStoreChange" labelInValue placeholder="选择门店" style="width: 100%">
            <a-select-option key>全部门店</a-select-option>
            <a-select-option :key="store.id" v-for="store in stores">{{store.name}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="7">
          <!-- <a-button @click="resetSearch" type="link">清空</a-button> -->
          <a-button :loading="searchLoading" @click="handleSearch" icon="search" type="primary">查询</a-button>
          <a-button
            :loading="exportLoading"
            @click="handleExport"
            icon="export"
            type="primary"
            v-if="authority.authority[67] ? authority.authority[67].enable : false"
          >导出</a-button>
        </a-col>
        <a-col :span="4"></a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="table-container">
      <a-table
        :columns="columns"
        :dataSource="rows"
        :loading="searchLoading"
        :locale="{ emptyText: '暂无数据' }"
        :pagination="pagination"
        :rowKey="record => record.id"
        @change="handleTableChange"
        size="middle"
      >
        <div slot="img" slot-scope="img, record">
          <div style="width:50px;float:left">
            <a-avatar :src="record.img" icon="user" shape="square" size="large" style="margin-right:10px" />
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
        <div slot="store_name" slot-scope="store_name, record">
          <a>教练: {{record.coach_name}}</a>
          <div>{{record.store_name}}</div>
        </div>
        <div slot="coach_status" slot-scope="coach_status, record">
          <div>
            <span>{{record.coach_status}}</span>
          </div>
          <div v-if="record.coach_begin_time !== null">
            <span style="color:#00000073">{{record.coach_begin_time}}</span>-
            <span style="color:#00000073">{{record.coach_end_time === null ? '未结束': record.coach_end_time}}</span>
          </div>
        </div>
        <div slot="order_status" slot-scope="order_status, record">
          <div>
            <div>{{record.order_status}}</div>
            <span style="color:#00000073">{{record.reserve_date}}</span>
          </div>
        </div>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const columns = [
  {
    title: '会员',
    dataIndex: 'img',
    key: 'img',
    width: '25%',
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '课程名称',
    key: 'course_name',
    dataIndex: 'course_name'
  },
  {
    title: '门店 | 教练',
    key: 'store_name',
    dataIndex: 'store_name',
    scopedSlots: { customRender: 'store_name' }
  },

  {
    title: '上课状态',
    key: 'coach_status',
    dataIndex: 'coach_status',
    scopedSlots: { customRender: 'coach_status' }
  },
  {
    title: '预约状态',
    key: 'order_status',
    dataIndex: 'order_status',
    scopedSlots: { customRender: 'order_status' }
  }
]
const dateFormat = 'YYYY-MM-DD'
export default {
  name: 'customer-list',
  data() {
    return {
      rows: [],
      columns,
      page: 1,
      size: 10,
      pagination: {},
      userName: '',
      dateRanges: {},
      beginDate: moment()
        .startOf('month')
        .format(dateFormat),
      endDate: moment()
        .endOf('month')
        .format(dateFormat),
      storeId: '',
      stores: [],
      exportLoading: false,
      searchLoading: false
    }
  },
  computed: {
    ...mapState(['authority'])
  },
  methods: {
    moment,
    handleDateRangeChange(date, dateString) {
      this.beginDate = dateString[0]
      this.endDate = dateString[1]
    },

    handleStoreChange(item) {
      this.storeId = item.key
    },

    handleSearch(valule) {
      this.searchLoading = true
      this.resetFilter()
      this.list().then(res => {
        this.filterData(res.data)
        this.searchLoading = false
      })
    },

    list() {
      const params = {
        user: this.userName,
        page: this.page,
        size: this.size,
        begin_date: this.beginDate,
        end_date: this.endDate,
        store_id: this.storeId
      }
      return this.$http.get('/report/user_course', {
        params
      })
    },
    listStores() {
      const params = {
        province: '福建省',
        city: '厦门市'
      }
      return this.$http.get('/stores/list', {
        params
      })
    },
    handleExport() {
      this.exportLoading = true
      const params = {
        user: this.userName,
        page: this.page,
        size: this.size,
        begin_date: this.beginDate,
        end_date: this.endDate,
        store_id: this.storeId
      }
      this.$http
        .get('/report/user_course/file/xlsx', {
          params,
          responseType: 'blob'
        })
        .then(res => {
          this.download(res.data)
          this.exportLoading = false
        })
        .catch(err => {
          this.$message.error('导出失败,请联系管理员')
        })
    },
    resetFilter() {
      ;(this.page = 1), (this.size = 10)
    },
    resetSearch() {
      this.userName = ''
      this.beginDate = ''
      this.endDate = ''
      this.storeId = ''

      this.resetFilter()
      this.handleSearch()
    },
    download(data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '私教上课记录报表.xlsx')
      document.body.appendChild(link)
      link.click()
    },
    filterData(res) {
      this.rows = res.items
      const pagination = { ...this.pagination }
      pagination.total = res.total
      this.pagination = pagination
    },

    handleTableChange(pagination) {
      this.pagination = pagination
      this.page = pagination.current
      this.size = pagination.pageSize
      this.searchLoading = true
      this.list().then(res => {
        this.filterData(res.data)
        this.searchLoading = false
      })
    }
  },
  created() {
    this.dateRanges = {
      今天: [moment(), moment()],
      本月: [moment().startOf('month'), moment().endOf('month')],
      上月: [
        moment()
          .subtract(1, 'month')
          .startOf('month'),
        moment()
          .subtract(1, 'month')
          .endOf('month')
      ],
      近三个月: [
        moment()
          .subtract(3, 'month')
          .startOf('month'),
        moment()
          .subtract(1, 'month')
          .endOf('month')
      ],
      近半年: [
        moment()
          .subtract(6, 'month')
          .startOf('month'),
        moment()
          .subtract(1, 'month')
          .endOf('month')
      ]
    }
  },
  mounted() {
    this.listStores().then(res => {
      this.stores = res.data
      this.handleSearch()
    })
  }
}
</script> 

<style lang="stylus">
.container
  padding 15px
  min-height 700px
  background #F0F2F5

  .btn-group-list
    background #fff
    box-shadow -2px 3px 10px rgb(212, 212, 212)

    button
      margin-right 8px

  .table-container
    background #fff
    box-shadow -2px 3px 10px rgb(212, 212, 212)
    margin-top 10px
</style>
