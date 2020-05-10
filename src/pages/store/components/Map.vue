<template>
  <div>
    <a-modal title="经纬度选择" :width=778 v-model="visible" @ok="handleOk" @cancel="handleClose">
      <div class="map-container">
        <a-row class="top-bar">
          <a-col :span="6">
            <a-input placeholder="请输入查询的地址" v-model="value" id="text_" type="text"/>
          </a-col>
          <a-col :span="6" style="text-align: center;">
            查询结果(经纬度)：
          </a-col>
          <a-col :span="6">
            <a-input placeholder="查询结果"  id="result_" type="text"/>
          </a-col>
          <a-col :span="6">
            <a-button value="查询" @click="searchByStationName()">查询</a-button>
          </a-col>
        </a-row>

        <div id="map-content" class="map-content"></div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: this.show,
      localSearch: null,
      map: null,
      value: '厦门市',
      result: null
    }
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    show(newVal) {
      const self = this
      this.visible = newVal
      if(newVal) {
        setTimeout(() => {
          self.initMap()
        }, 300)
      }
    }
  },

  methods: {
    initMap() {
      this.map = new BMap.Map("map-content");
      this.map.centerAndZoom("厦门", 15);
      this.map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      this.map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
      this.map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
      this.map.addControl(new BMap.OverviewMapControl({
        isOpen: true,
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      })); //右下角，打开
      this.localSearch = new BMap.LocalSearch(this.map);
      this.localSearch.enableAutoViewport(); //允许自动调节窗体大小
    },

    handleOk () {
      this.handleClose()
      this.handleSendData()
    },

    handleClose () {
      this.visible = false;
      this.$emit('MapShow', this.visible)
    },

    handleSendData() {
      this.result && this.$emit('MapSendData', this.result)
    },

    searchByStationName() {
      const self = this
      this.map.clearOverlays(); //清空原来的标注
      var keyword = this.value;

      self.localSearch.setSearchCompleteCallback((searchResult) => {
        var poi = searchResult.getPoi(0);
        document.getElementById("result_").value = poi.point.lng + "," + poi.point.lat;
        self.map.centerAndZoom(poi.point, 13);
        var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat)); // 创建标注，为要查询的地方对应的经纬度
        self.map.addOverlay(marker);
        var content = self.value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
        var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
        marker.addEventListener("click", function() {
          this.openInfoWindow(infoWindow);
        });
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        self.result = poi.point
      });
      self.localSearch.search(keyword);
    }
  },

  mounted() {
  },
}
</script>

<style lang="stylus">
.map-container {
  width: 730px;
  height: 590px;
  overflow: hidden;
}

.map-content {
  width: 730px;
  height: 590px;
}

.top-bar {
  padding-bottom: 10px;
  .ant-col-6 {
    height: 32px;
    line-height: 32px;
  }
}

.ant-modal-wrap {
  z-index: 20000;
}
</style>