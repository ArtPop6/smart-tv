<template>
  <div class="header">
    <div class="right">
      <div class="right__select">
        <a-select @change="selectStore" class="select" v-model="storeid">
          <a-select-option :key="index" :value="store.id" class="option" v-for="(store,index) in stores">{{store.name}}</a-select-option>
        </a-select>
      </div>
      <div class="right__img">
        <a-carousel :autoplay="true">
          <div :key="index" class="img" v-for="(item, index) in swipePics">
            <img :src="item.coach_body_img_url" class="img__size" />
            <span class="img__name">{{item.coach_nick_name}}</span>
            <span class="img__detail">{{item.coach_description}}</span>
          </div>
        </a-carousel>
      </div>
      <div class="right__foot">
        <span class="right__foot--name">扫码查看本周课程</span>
        <canvas class="right__foot--qrcode" id="canvas"></canvas>
      </div>
    </div>
    <div class="left">
      <div class="left__name">
        <div class="left__name--time">课程时间</div>
        <div class="left__name--time">授课教练</div>
        <div class="left__name--class">课程名称</div>
        <div class="left__name--time">课程地点</div>
        <div class="left__name--seat">座位</div>
      </div>
      <div class="left__img">
        <div
          :class="time.start?'highlight':'min'"
          :data-id="time.timetable_id"
          :key="index"
          @click="goseat"
          class="img__row"
          v-for="(time,index) in times"
        >
          <div class="row__one">
            {{time.begin_time}} ~ {{time.end_time}}
            <span class="underway" v-if="time.start">进行中···</span>
          </div>
          <div class="row__two">
            <img :src="time.coach_avatar" class="row__two--img" />
            <span class="row__two--name">{{time.coach_nick_name}}</span>
          </div>
          <div class="row__three">
            <span class="row__three--name">{{time.course_name}}</span>
            <div class="row__three--kcl">
              <img class="row__three--img" src="../img/fire.png" />
              <span class="row__three--text">消耗热量 {{time.calories}} kcal</span>
            </div>
          </div>
          <div class="row__four">{{time.space_name}}</div>
          <div class="row__five">余{{time.remain}}位</div>
        </div>
      </div>
      <div class="left__foot">
        <div class="left__foot--time">{{ nowDate + ' ' + nowWeek + ' ' + nowTime }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import GlobalHeader from 'src/layouts/GlobalHeader'
import GlobalFooter from 'src/layouts/GlobalFooter'
import { mapState, mapActions } from 'vuex'
import SliderMenu from '../components/menu/SliderMenu'
import 'ant-design-vue/dist/antd.css'
import QRCode from 'qrcode'

export default {
  components: {
    QRCode: QRCode
  },
  data() {
    return {
      codes: '',
      codedate: '',
      stores: [],
      storeid: '',
      times: [],
      timetable_id: '',
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      autoplay: true,
      swipePics: [],
      setTime: ''
    }
  },
  methods: {
    list() {
      this.$http.get(`/group_exercise/schedule?store_id=${this.storeid}`).then(res => {
        this.times = res.data
        this.swipePics = []
        for (let i = 0; i < this.times.length; i++) {
          // if (this.times[i].start) {
          this.swipePics.push(this.times[i])
          // }
        }
      })
    },
    storeList() {
      return this.$http.get(`/stores/list`).then(res => {
        this.stores = res.data
        this.storeid = res.data[0].id
      })
    },
    // 获取二维码
    useqrcode() {
      this.$http.get(`/group_exercise/timetable_qr_code?store_id=${this.storeid}`).then(res => {
        this.codedate = res.data
        var canvas = document.getElementById('canvas')
        QRCode.toCanvas(canvas, this.codedate, function(error) {
          if (error) console.error(error)
        })
      })
    },
    //选择门店
    selectStore(value) {
      this.storeid = value
      this.list()
      this.useqrcode()
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
      _this.nowTime = hh + ':' + mf
      _this.nowDate = yy + '年' + mm + '月' + dd + '日'
    },
    goseat(e) {
      this.timetable_id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'Class',
        query: {
          timetable_id: e.currentTarget.dataset.id
        }
      })
    }
  },
  created() {
    this.storeList().then(() => {
      this.list()
      this.useqrcode()
    })
    // this.list()
  },
  mounted() {
    this.currentTime()
    this.setTime = setInterval(() => {
      this.list()
    }, 20000)
  },
  // 销毁定时器
  beforeDestroy: function() {
    if (this.getDate) {
      clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
    }
    if (this.setTime) {
      clearInterval(this.setTime)
    }
  }
}
</script>
<style lang="stylus">
.header
  display flex
  display -webkit-box /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display -moz-box /* 老版本语法: Firefox (buggy) */
  display -ms-flexbox /* 混合版本语法: IE 10 */
  display -webkit-flex /* 新版本语法: Chrome 21+ */
  -webkit-flex-wrap nowrap
  -ms-flex-wrap nowrap
  flex-wrap nowrap
  width 960px
  height 100%
  background #333239

  .right
    display flex
    flex-direction column
    height 100%
    width 270px

    .right__select
      display flex
      padding-top 4px
      line-height 45px
      height 45px
      border-bottom 1px solid rgba(252, 219, 0, 0.7)

      .select
        margin-left 15px
        width 250px
        height 30px
        margin-top 4px
        background #333239
        border none
        color #000
        font-size 18px

        .ant-select-selection--single
          background #333239

        .option
          width 200px
          height 40px
          font-size 14px

    .right__img
      flex 1
      justify-content center
      align-items center

      .ant-carousel
        width 100%
        height 100%

        .slick-slider
          width 100%
          height 100%

          .slick-list
            width 100%
            height 100%

            .slick-track
              width 100%
              height 100%

              .slick-slide
                width 100%
                height 100%

                div
                  width 100%
                  height 100%

                  .img
                    width 100%
                    height 100%
                    position relative

                    .img__size
                      width 100%
                      height 420px

                    .img__name
                      position absolute
                      left 23px
                      bottom 96px
                      font-size 18px
                      color rgba(255, 255, 255, 1)

                    .img__detail
                      position absolute
                      bottom 76px
                      left 23px
                      width 227px
                      size 14px
                      color rgba(255, 255, 255, 1)
                      overflow hidden
                      text-overflow ellipsis
                      display -webkit-box
                      -webkit-box-orient vertical
                      -webkit-line-clamp 4

    .right__foot
      display flex
      align-items center
      height 70px
      border-top 1px solid rgba(252, 219, 0, 0.7)
      box-shadow 0px -2px 0px 0px rgba(252, 219, 0, 0.7), 0px -2px 90px 0px rgba(252, 219, 0, 0.7)

      .right__foot--name
        font-size 20px
        color rgba(255, 255, 255, 1)
        font-weight bold
        margin-left 28px

      .right__foot--qrcode
        width 48px !important
        height 48px !important
        margin-left 20px

  .left
    display flex
    flex-direction column
    width 690px
    height 100%

    .left__name
      display flex
      justify-content space-between
      height 45px
      border-bottom 1px solid rgba(252, 219, 0, 0.7)

      .left__name--time
        width 20%
        height 45px
        text-align center
        line-height 45px
        color rgba(255, 255, 255, 1)

      .left__name--class
        width 30%
        height 45px
        text-align center
        line-height 45px
        color rgba(255, 255, 255, 1)

      .left__name--seat
        width 10%
        height 45px
        text-align center
        line-height 45px
        color rgba(255, 255, 255, 1)

    .left__img
      flex-direction column
      flex 1
      -webkit-box-flex 1 /* OLD - iOS 6-, Safari 3.1-6 */
      -moz-box-flex 1 /* OLD - Firefox 19- */
      -webkit-flex 1 /* Chrome */
      -ms-flex 1
      overflow-x hidden
      overflow-y auto

      .img__row
        position relative
        // justify-content space-between
        width 690px
        height 80px
        margin-top 10px
        background #232122

        .row__one
          position absolute
          text-align center
          line-height 80px
          width 20%
          height 80px
          color rgba(0, 0, 0, 1)
          font-size 14px
          background rgba(252, 219, 0, 1)

          .underway
            position absolute
            top 20px
            left 42px
            color red

        .row__two
          position absolute
          left 20%
          width 20%
          height 80px
          text-align center
          line-height 80px

          .row__two--img
            width 40px
            height 40px
            background #ADADAD
            padding 3px
            border-radius 100%

          .row__two--name
            margin-left 22px
            font-size 14px
            color rgba(255, 255, 255, 1)

        .row__three
          position absolute
          left 40%
          width 30%
          height 80px
          margin 0 auto
          line-height 80px

          .row__three--name
            position absolute
            width 100%
            text-align center
            top -10px
            height 20px
            color rgba(255, 255, 255, 1)
            font-size 14px

          .row__three--kcl
            position absolute
            width 100%
            text-align center
            top 10px
            height 20px

            .row__three--img
              height 19px
              width 12px
              margin-right 5px

            .row__three--text
              color rgba(252, 219, 0, 1)
              font-size 14px
              height 20px

        .row__four
          position absolute
          left 70%
          width 20%
          height 80px
          text-align center
          line-height 80px
          font-size 14px
          color rgba(255, 255, 255, 1)

        .row__five
          position absolute
          right 1%
          width 9%
          height 80px
          text-align center
          line-height 80px
          color rgba(255, 255, 255, 1)
          font-size 18px

    .left__foot
      display flex
      flex-direction row-reverse
      align-items center
      height 70px
      border-top 1px solid rgba(252, 219, 0, 0.7)
      // border-top 1px solid rgba(252, 219, 0, 0.7)
      -moz-box-shadow 0px -2px 0px 0px rgba(252, 219, 0, 0.7), 0px -2px 90px 0px rgba(252, 219, 0, 0.7)
      -webkit-box-shadow 0px -2px 0px 0px rgba(252, 219, 0, 0.7), 0px -2px 90px 0px rgba(252, 219, 0, 0.7)
      box-shadow 0px -2px 0px 0px rgba(252, 219, 0, 0.7), 0px -2px 90px 0px rgba(252, 219, 0, 0.7)

      .left__foot--time
        margin-right 20px
        font-size 20px
        color rgba(255, 255, 255, 1)

.ant-select-selection
  background none
  color #fff
  border none

.ant-select-arrow .ant-select-arrow-icon svg
  color #fff

.ant-carousel >>> .slick-slide
  text-align center
  height 160px
  line-height 160px
  background #364d79
  overflow hidden

.ant-carousel >>> .slick-slide h3
  color #fff

.highlight
  // border 2px solid red
  box-shadow 0px 2px 10px 2px red
  // animation fade 600ms infinite
  // -webkit-animation fade 600ms infinite
  // transform skew(10deg, 0deg)
  // transition width 2s, height 2s, transform 2s

.min
  transform translate(10px, 0px)

@keyframes fade
  from
    opacity 1

  50%
    opacity 0.4

  to
    opacity 1

@keyframes fade
  from
    opacity 1

  50%
    opacity 0.4

  to
    opacity 1
</style>
