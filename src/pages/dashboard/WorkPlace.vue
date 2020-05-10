<template>
  <div class="home">
    <a-row class="panel">
      <a-col :span="12" class="brand">
        <img alt class="i-logo pull-left" src="/static/crm.png" />
        <p class="t-1">{{home.gym_store.name}}</p>
        <p class="t-2">{{home.gym_store.description}}</p>
      </a-col>
      <a-col :span="4" class="card">
        <div class="row-1">今日购卡</div>
        <div class="row-2">
          <span>{{home.buy_count}}</span>
          <span class="small">人</span>
        </div>
      </a-col>
      <a-col :span="4" class="card">
        <div class="row-1">今日激活</div>
        <div class="row-2">
          <span>{{home.active_count}}</span>
          <span class="small">人</span>
        </div>
      </a-col>
      <a-col :span="4" class="card">
        <div class="row-1">今日流量</div>
        <div class="row-2">
          <span>{{home.enter_count}}</span>
          <span class="small">次</span>
        </div>
      </a-col>
    </a-row>

    <a-row class="tools">
      <a-col :span="24">
        <div class="tool-content">
          <h4>常用工具</h4>
          <div id="10">
            <a-time-picker @change="onChangeTimePicker" format="h:mm:ss A" use12Hours />
          </div>
          <div class="list">
            <li @click="addCustomer" v-if="authority.authority[29] ? authority.authority[29].enable : false">
              新增客户
              <span class="myicon">
                <a-icon type="plus-circle" />
              </span>
            </li>
            <li class="sep" v-if="authority.authority[62] ? authority.authority[62].enable : false">
              <div>
                <span>更多工具</span>
                <br />
                <span>敬请期待</span>
              </div>
              <span class="myicon">
                <a-icon type="right-circle" />
              </span>
            </li>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      home: {
        gym_store: {
          name: '',
          description: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['authority'])
  },
  methods: {
    onChangeTimePicker(time, timeString) {
      console.log(time, timeString)
    },
    addCustomer() {
      this.$router.push({
        name: 'userAdd'
      })
    },

    initPage() {
      this.$http.get('index/banners').then(data => {
        this.home = data.data
      })
    }
  },

  mounted() {
    this.initPage()
  }
}
</script>

<style lang="stylus">
.home
  .panel
    height 216px
    border-bottom 1px solid #efefef

    .i-logo
      margin 40px 0px 0px 60px
      width 130px
      height 130px

      img
        width 100%
        height 100%

    .t-1
      padding 67px 0 0 26px
      font-size 30px
      margin 0 0 0 180px

    .t-2
      margin 10px 0 0 206px
      padding 0 0 0 0px

  .tools
    .tool-content
      padding 10px 0 0 20px

      h4
        height 30px
        border-bottom 4px solid #ffde00
        line-height 30px
        display inline-block
        font-size 16px

      .list
        padding-top 20px

        li
          margin 0 24px 0 0
          padding 0 0 0 24px
          width 343px
          height 178px
          line-height 178px
          list-style none
          font-size 16px
          display inline-block
          border-radius 12px
          background #FFDE00
          overflow hidden
          position relative
          cursor pointer

          span
            display inline-block

          &.sep
            background #0396FF

            div
              line-height 20px
              padding-top 72px

          .myicon
            position absolute
            right 15px
            top 70px
            width 50px
            height 50px
            line-height 0
            font-size 40px
            color #fff

  .card
    .row-1
      height 108px
      display flex
      justify-content center
      align-items center
      font-size 22px

    .row-2
      height 108px
      justify-content center
      align-items center
      display flex
      font-size 22px

      .small
        font-size 14px
        position relative
        top 2px
</style>