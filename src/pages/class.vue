<template>
  <div class="location">
    <div class="head">
      <div class="head__index">
        <a-icon style="color:rgba(255, 255, 255, 1);fontSize:22px" type="left" />
        <span @click="goIndex()" class="head__index--text">返回首页</span>
      </div>
      <div class="head__name">{{timetabkls.coach_name}}</div>
    </div>
    <div class="center">
      <div class="center__flex">
        <div :key="index" class="center__lie" v-for="(book,index) in book_seat">
          <div :key="index" class="center__hang" v-for="(books,index) in book.row_item">
            <div :class="books.sign_state=='UNSIGN'?'show':''" class="center__page">
              <img :src="books.avatar" class="center__img" v-if="books.avatar" />
              <div class="center__img" v-if="!books.avatar">
                <img class="center_img-size" src="../img/running.png" />
              </div>
              <span class="center__status">{{books.seat_id}} {{books.nick_name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="foot__left">
        <span class="foot__text">{{timetabkls.space_name}}-{{timetabkls.course_name}}（消耗热量 {{timetabkls.calories}} kcal）</span>
        <canvas class="foot--qrcode" id="canvas"></canvas>
      </div>
      <div class="foot__time">{{ nowDate + ' ' + nowWeek + ' ' + nowTime }}</div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcode'

export default {
  components: {
    QRCode: QRCode
  },
  data() {
    return {
      codes: '',
      codedate: '',
      book_seat: [],
      timetabkls: {},
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      courseList: ''
    }
  },
  methods: {
    // 获取数据
    list() {
      const timetableid = this.$route.query.timetable_id
      this.$http.get(`/group_exercise/book_seat?timetable_id=${timetableid}`).then(res => {
        this.timetabkls = res.data
        this.book_seat = res.data.seats
      })
    },
    // 获取二维码
    useqrcode() {
      const timetableid = this.$route.query.timetable_id
      this.$http.get(`/group_exercise/sign_qr_code?timetable_id=${timetableid}`).then(res => {
        this.codedate = res.data
        var canvas = document.getElementById('canvas')
        QRCode.toCanvas(canvas, this.codedate, function(error) {
          if (error) console.error(error)
          console.log('QRCode success!')
        })
      })
    },
    currentTime() {
      setInterval(this.getDate, 500)
    },
    getDate: function() {
      var _this = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      let week = new Date().getDay()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      if (week == 1) {
        this.nowWeek = '星期一'
      } else if (week == 2) {
        this.nowWeek = '星期二'
      } else if (week == 3) {
        this.nowWeek = '星期三'
      } else if (week == 4) {
        this.nowWeek = '星期四'
      } else if (week == 5) {
        this.nowWeek = '星期五'
      } else if (week == 6) {
        this.nowWeek = '星期六'
      } else {
        this.nowWeek = '星期日'
      }
      _this.nowTime = hh + ':' + mf + ':' + ss
      _this.nowDate = yy + '年' + mm + '月' + dd + '日'
    },
    goIndex() {
      this.$router.push({
        name: 'dashboard'
      })
    }
  },
  created() {
    this.list()
    this.useqrcode()
  },
  mounted() {
    console.log(this.$route.query.timetable_id)
    if (this.$route.query.timetable_id != undefined) {
      this.courseList = setInterval(() => {
        this.list()
      }, 20000)
    }
    this.currentTime()
  },
  // 销毁定时器
  beforeDestroy: function() {
    if (this.getDate) {
      console.log('销毁定时器')
      clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
    }
    if (this.courseList) {
      clearInterval(this.courseList)
    }
  }
}
</script>
<style lang="stylus" scoped>
.location
  display flex
  flex-direction column
  width 960px
  height 100%
  background #333239

  .head
    display flex
    width 100%
    height 54px

    .head__index
      display flex
      margin 10px 0 0 16px
      height 25px

      .head__index--text
        font-size 18px
        color rgba(255, 255, 255, 1)
        height 25px
        line-height 20px

    .head__name
      text-align center
      line-height 40px
      font-size 18px
      color rgba(0, 0, 0, 1)
      width 480px
      height 40px
      background rgba(252, 219, 0, 1)
      margin-left 128px
      border-radius 0px 0px 50px 50px

  .center
    flex 1
    overflow auto

    .center__flex
      // display flex
      overflow auto
      flex-direction column
      justify-content center
      align-items center
      padding-left 60px

      .center__lie
        display flex

        .center__hang
          display flex
          flex-direction column

          .center__page
            display flex
            flex-direction column
            text-align center
            margin-right 60px
            margin-bottom 20px
            align-items center

            .center__img
              display flex
              align-items center
              justify-content center
              width 48px
              height 48px
              border-radius 100%
              background rgba(252, 219, 0, 1)

            .center_img-size
              width 30px
              height 30px

            .center__status
              margin-top 3px
              font-size 14px
              width 80px
              color rgba(255, 255, 255, 1)

  .foot
    display flex
    justify-content space-between
    align-items center
    width 100%
    height 70px
    border-top 1px solid #fcdb00

    // box-shadow 0px -2px 0px 0px rgba(252, 219, 0, 0.7), 0px -2px 90px 0px rgba(252, 219, 0, 0.7)
    .foot__left
      display flex
      margin-left 28px

      .foot__text
        margin auto
        font-size 20px
        color rgba(255, 255, 255, 1)

      .foot--qrcode
        width 48px !important
        height 48px !important
        margin-left 10px

    .foot__time
      margin-right 25px
      font-size 20px
      color rgba(255, 255, 255, 1)

.show
  opacity 0.4
</style>