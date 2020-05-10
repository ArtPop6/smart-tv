<template>
  <a-layout class="store-list">
    <a-layout-header class="tools">
      <a-row>
        <a-col :span="12" align="left">
          <strong>门店状态:</strong>
          <template v-for="tag in statusEnums">
            <a-checkable-tag
              :checked="selectedStatus.indexOf(tag.key) > -1"
              :key="tag.key"
              @change="checked => handleStatusChange(tag.key, checked)"
            >{{ tag.name }}</a-checkable-tag>
          </template>
          <a-divider type="vertical"></a-divider>
          <strong>门店分类:</strong>
          <template v-for="tag in catelogs">
            <a-checkable-tag
              :checked="selectedCatalogs.indexOf(tag) > -1"
              :key="tag"
              @change="checked => handleCatalogChange(tag, checked)"
            >{{ tag }}</a-checkable-tag>
          </template>
          <a-divider type="vertical"></a-divider>
          <a-button @click="reset">清空</a-button>
        </a-col>
        <a-col :span="2" align="right"></a-col>
        <a-col :span="10" align="right">
          <a-input-group class="button-group">
            <a-row :gutter="8">
              <a-col :span="18">
                <a-input-search @search="handleNameChange" placeholder="门店名称" style="width:100%">
                  <a-button :loading="loading" icon="search" slot="enterButton" type="primary">搜索</a-button>
                </a-input-search>
              </a-col>
              <a-col :span="6">
                <a-button
                  @click="add"
                  icon="plus"
                  style="width:100%"
                  type="primary"
                  v-if="authority.authority[33] ? authority.authority[33].enable : false"
                >添加门店</a-button>
              </a-col>
            </a-row>
          </a-input-group>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="table-container">
      <a-list :dataSource="list" :grid="{ gutter: 15, column: 4 }">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card :headStyle="{ paddingLeft: '10px' }" hoverable>
            <span slot="title" style="color:#1890FF">
              <a-icon style="color:#1890FF" type="shop" />
              {{ item.name }}
            </span>
            <img :src="item.img" slot="cover" />
            <template slot="actions">
              <span @click="changeStatus(item)" v-if="authority.authority[63] ? authority.authority[63].enable : false">
                <a-icon :type="item.status === 'UP' ? 'arrow-down' : 'arrow-up'" href="javascript:;" />
                {{ item.status === "UP" ? "下架" : "上架" }}
              </span>
              <span @click="edit(item)" v-if="authority.authority[61] ? authority.authority[61].enable : false">
                <a-icon href="javascript:;" type="edit" />
                <span>编辑</span>
              </span>
              <span @click="view(item)" v-if="authority.authority[65] ? authority.authority[65].enable : false">
                <a-icon type="ellipsis" />
                <span>详情</span>
              </span>
            </template>
          </a-card>
        </a-list-item>
        <div class="loadMore" slot="loadMore" v-if="showLoadingMore">
          <a-spin v-if="loadingMore" />
          <a-button :loading="loading" @click="onLoadMore" v-else>---更多门店---</a-button>
        </div>
      </a-list>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'store-list',

  data() {
    return {
      page: 1,
      size: 10,
      name: '',
      status: '',
      catalog: '',
      catelogs: ['自由馆', '旗舰店', '智享馆'],
      statusEnums: [{ key: 'UP', name: '上架' }, { key: 'DOWN', name: '下架' }],
      selectedCatalogs: [],
      selectedStatus: [],
      form: this.$form.createForm(this),
      list: [],
      loading: false,
      loadingMore: false,
      showLoadingMore: true
    }
  },

  computed: {
    ...mapState(['authority'])
  },

  methods: {
    handleCatalogChange(tag, checked) {
      this.catalog = tag
      this.selectedCatalogs = []
      this.selectedCatalogs = this.selectedCatalogs.concat(this.catalog)
      this.list = []
      this.search()
    },

    handleStatusChange(tag, checked) {
      this.status = tag
      this.selectedStatus = []
      this.selectedStatus = this.selectedStatus.concat(this.status)
      this.list = []
      this.search()
    },

    handleNameChange(value) {
      this.name = value
      this.list = []
      this.search()
    },

    getList() {
      let params = {
        page: this.page,
        size: this.size
      }

      if (!!this.name) {
        params.name = this.name
      }

      if (!!this.catalog) {
        params.catalog = this.catalog
      }

      if (!!this.status) {
        params.status = this.status
      }

      return this.$http.get('/stores', {
        params
      })
    },

    reset() {
      this.page = 1
      this.size = 10
      this.name = ''
      this.catalog = ''
      this.status = ''
      this.selectedCatalogs = []
      this.selectedStatus = []
      this.search()
    },

    filterData(res) {
      this.list = res.items == null ? [] : res.items
      const data = this.list
      if (data.length === res.total) {
        this.showLoadingMore = false
      }
    },

    search() {
      this.getList().then(res => {
        this.filterData(res.data)
      })
    },

    add() {
      this.$router.push({
        name: 'storeAdd'
      })
    },

    edit(item) {
      this.$router.push({ name: 'StoreEdit', params: { id: item.id } })
    },

    view(item) {
      this.$router.push({ name: 'StoreView', params: { id: item.id } })
    },

    changeStatus(res) {
      const _shouldUpdateVal = res.status === 'UP' ? 'DOWN' : 'UP'
      this.$http
        .put('/stores', {
          id: res.id,
          status: _shouldUpdateVal
        })
        .then(() => {
          this.getList().then(res => {
            this.filterData(res.data)
          })
        })
    },
    onLoadMore() {
      this.page++
      this.loadingMore = true
      this.getList().then(res => {
        this.list = this.list.concat(res.data.items)
        if (this.list.length === res.data.total) {
          this.showLoadingMore = false
        }
        this.loadingMore = false
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    }
  },
  mounted() {
    this.getList().then(res => {
      this.loadingMore = false
      this.filterData(res.data)
    })
  }
}
</script>

<style lang="stylus">
.store-list
  padding 15px
  background #F0F2F5
  height 100%

  .tools
    background #ffffff
    margin-bottom 10px
    box-shadow -2px 3px 10px rgb(212, 212, 212)

    .button-group
      padding-top 15px

  .table-container
    padding 15px
    background-color white
    box-shadow -2px 3px 10px rgb(212, 212, 212)
    min-height 770px

    .loadMore
      text-align center
      margin-top 12px
      height 32px
      line-height 32px

      button
        color #1890FF

  .ant-card-cover
    img
      height 130px
</style>
